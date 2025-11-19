'use client';

import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import styles from './Chat.module.css';
import Navbar from '../../components/Navbar';

// --- Ícones ---
const ChevronDownIcon = () => (<svg height="16" viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg>);
const UserAvatarIcon = ({ className }) => (<svg className={className || styles.avatar} viewBox="0 0 24 24" fill="#757575"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.67 0-5.33-1.33-6.67-3.33.2-.8 3.96-2.02 6.67-2.02s6.47 1.22 6.67 2.02c-1.34 2-4 3.33-6.67 3.33z"></path></svg>);
const SendIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>);

export default function ChatPage() {
    const API_BASE_URL = 'https://api.desenrola.shop';

    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        }
        return null;
    };

    const getUserIdFromToken = () => {
        const token = getAuthToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.nameid;
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    };

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const connectionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const conversationsPollingRef = useRef(null);

    useEffect(() => {
        const token = getAuthToken();
        
        if (!token) {
            console.error('Token não encontrado. Usuário não autenticado.');
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return;
        }

        const userId = getUserIdFromToken();
        
        if (!userId) {
            console.error('Não foi possível obter o ID do usuário. Token inválido.');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                window.location.href = '/auth/login';
            }
            return;
        }

        setAuthToken(token);
        setCurrentUserId(userId);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!authToken) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}/chatHub`, {
                accessTokenFactory: () => authToken,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        const handleNewMessage = (message) => {
            console.log('🔔 Nova mensagem recebida via SignalR:', message);
            setMessages(prevMessages => {
                const exists = prevMessages.some(m => m.id === message.id);
                if (!exists) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
            setTimeout(() => fetchConversations(), 500);
        };

        connection.on('ReceiveMessage', handleNewMessage);
        connection.on('NewMessage', handleNewMessage);
        connection.on('MessageReceived', handleNewMessage);
        connection.on('OnMessageReceived', handleNewMessage);

        connection.onreconnecting(() => console.log('🔄 SignalR reconectando...'));
        connection.onreconnected(() => {
            console.log('✅ SignalR reconectado!');
            fetchConversations();
        });
        connection.onclose((error) => console.log('❌ SignalR desconectado', error));

        connection.start()
            .then(() => {
                console.log('✅ SignalR conectado com sucesso!');
                connectionRef.current = connection;
            })
            .catch(err => {
                console.error('❌ Erro ao conectar SignalR:', err);
                setTimeout(() => {
                    connection.start().catch(e => console.error('❌ Falha na reconexão:', e));
                }, 5000);
            });

        return () => {
            console.log('🔌 Desconectando SignalR...');
            connection.stop();
        };
    }, [authToken]);

    const markAsRead = async (conversationId) => {
        const token = getAuthToken();
        if (!token) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Message/conversation/${conversationId}/mark-as-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return;
            }

            console.log('✅ Mensagens marcadas como lidas');
        } catch (error) {
            console.error('❌ Erro ao marcar mensagens como lidas:', error);
        }
    };

    const fetchConversations = async () => {
        const token = getAuthToken();
        if (!token) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Message/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Erro ao buscar conversas:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId, silent = false) => {
        const token = getAuthToken();
        if (!token) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/Message/conversation/${conversationId}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                if (!silent) {
                    console.log('📨 Mensagens carregadas:', data.length);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
        }
    };

    const sendMessage = async () => {
        if (!messageInput.trim() || !activeChat || sendingMessage) return;

        const token = getAuthToken();
        if (!token) {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return;
        }

        setSendingMessage(true);
        const messageContent = messageInput;
        setMessageInput('');

        console.log('📤 Enviando mensagem:', messageContent);

        try {
            const response = await fetch(`${API_BASE_URL}/api/Message/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                },
                body: JSON.stringify({
                    receiverId: activeChat.otherUserId,
                    content: messageContent
                })
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return;
            }

            if (response.ok) {
                const sentMessage = await response.json();
                console.log('✅ Mensagem enviada com sucesso:', sentMessage);

                setMessages(prev => {
                    const exists = prev.some(m => m.id === sentMessage.id);
                    if (!exists) {
                        return [...prev, sentMessage];
                    }
                    return prev;
                });

                fetchConversations();
            } else {
                console.error('❌ Erro ao enviar mensagem - Status:', response.status);
                setMessageInput(messageContent);
            }
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            setMessageInput(messageContent);
        } finally {
            setSendingMessage(false);
        }
    };

    const selectConversation = async (conversation) => {
        setActiveChat(conversation);
        await fetchMessages(conversation.conversationId);
        setIsSidebarOpen(false);

        if (conversation.unreadMessagesCount > 0) {
            await markAsRead(conversation.conversationId);
            fetchConversations();
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchConversations();
        }
    }, [authToken]);

    useEffect(() => {
        if (!authToken) return;

        conversationsPollingRef.current = setInterval(() => {
            fetchConversations();
        }, 3000);

        return () => {
            if (conversationsPollingRef.current) {
                clearInterval(conversationsPollingRef.current);
            }
        };
    }, [authToken]);

    useEffect(() => {
        if (!activeChat) return;

        pollingIntervalRef.current = setInterval(async () => {
            const token = getAuthToken();
            if (!token) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/Message/conversation/${activeChat.conversationId}/history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('auth_token');
                    sessionStorage.removeItem('auth_token');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setMessages(prevMessages => {
                        const hasChanges = data.length !== prevMessages.length ||
                            data.some((newMsg, idx) => {
                                const oldMsg = prevMessages[idx];
                                return !oldMsg || oldMsg.isRead !== newMsg.isRead || oldMsg.id !== newMsg.id;
                            });

                        if (hasChanges) {
                            const hasUnread = data.some(msg => !msg.isRead && msg.senderId !== currentUserId);
                            if (hasUnread) {
                                markAsRead(activeChat.conversationId);
                            }
                            return data;
                        }

                        return prevMessages;
                    });
                }
            } catch (error) {
                console.error('Erro no polling:', error);
            }
        }, 2000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [activeChat, currentUserId]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <>
            <Navbar />
            
            <div className={styles.chatContainer}>
                {/* BOTÃO HAMBURGER - MOBILE */}
                <button
                    className={styles.hamburgerButton}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Menu"
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </button>

                {/* OVERLAY - MOBILE */}
                {isSidebarOpen && (
                    <div
                        className={styles.overlay}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* PAINEL DA ESQUERDA */}
                <div className={`${styles.contactList} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.contactListHeader}>
                        <div className={styles.contactListHeaderLeft}>
                            Mensagens
                            <ChevronDownIcon />
                            <span>{conversations.length}</span>
                        </div>
                    </div>

                    <div className={styles.contactsScroll}>
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.conversationId}
                                    className={`${styles.contactItem} ${activeChat?.conversationId === conv.conversationId ? styles.active : ''}`}
                                    onClick={() => selectConversation(conv)}
                                >
                                    <UserAvatarIcon />
                                    <div className={styles.contactItemInfo}>
                                        <h3>{conv.otherUserName}</h3>
                                        <p>{conv.lastMessage}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                        <span className={styles.contactItemTime}>
                                            {formatTime(conv.lastMessageDate)}
                                        </span>
                                        {conv.unreadMessagesCount > 0 && (
                                            <span style={{
                                                backgroundColor: '#0084ff',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {conv.unreadMessagesCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* PAINEL DA DIREITA */}
                <div className={styles.chatWindow}>
                    {activeChat ? (
                        <>
                            <div className={styles.chatHeader}>
                                <UserAvatarIcon />
                                <div className={styles.chatHeaderInfo}>
                                    <h3>{activeChat.otherUserName}</h3>
                                    <p>Online</p>
                                </div>
                            </div>

                            <div className={styles.messagesContainer}>
                                {messages.map((msg) => {
                                    const isFromMe = msg.senderId === currentUserId;
                                    return (
                                        <div
                                            key={msg.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isFromMe ? 'flex-end' : 'flex-start',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: '60%',
                                                    padding: '10px 14px',
                                                    borderRadius: '18px',
                                                    backgroundColor: isFromMe ? '#E8F5E9' : '#e4e6eb',
                                                    color: isFromMe ? '#1c1c1c' : 'black',
                                                    wordWrap: 'break-word'
                                                }}
                                            >
                                                {msg.content}
                                                <div style={{
                                                    fontSize: '11px',
                                                    marginTop: '4px',
                                                    opacity: 0.6,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    justifyContent: 'flex-end'
                                                }}>
                                                    <span>
                                                        {new Date(msg.sentAt).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {isFromMe && (
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '2px' }}>
                                                            {msg.isRead ? (
                                                                <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                                                    <path d="M11.0716 0.928955L4.41421 7.58635L1.92893 5.10107L0.514709 6.51528L4.41421 10.4148L12.4858 2.34317L11.0716 0.928955Z" fill="#4FC3F7" />
                                                                    <path d="M15.4858 0.928955L8.82843 7.58635L7.41421 6.17214L6 7.58635L8.82843 10.4148L17 2.24264L15.4858 0.928955Z" fill="#4FC3F7" />
                                                                </svg>
                                                            ) : (
                                                                <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                                                    <path d="M11.0716 0.928955L4.41421 7.58635L1.92893 5.10107L0.514709 6.51528L4.41421 10.4148L12.4858 2.34317L11.0716 0.928955Z" fill="#757575" />
                                                                    <path d="M15.4858 0.928955L8.82843 7.58635L7.41421 6.17214L6 7.58635L8.82843 10.4148L17 2.24264L15.4858 0.928955Z" fill="#757575" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className={styles.inputArea}>
                                <input
                                    type="text"
                                    placeholder="Escreva sua mensagem"
                                    className={styles.textInput}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    disabled={sendingMessage}
                                />
                                <button
                                    className={styles.sendButton}
                                    onClick={sendMessage}
                                    disabled={sendingMessage || !messageInput.trim()}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#65676b',
                            fontSize: '18px'
                        }}>
                            Selecione uma conversa para começar
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}