'use client';

import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import styles from './Chat.module.css';

// --- Ícones ---
const ChevronDownIcon = () => (<svg height="16" viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg>);
const PlusIcon = () => (<svg height="20" viewBox="0 0 24 24" width="20" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>);
const UserAvatarIcon = ({ className }) => (<svg className={className || styles.avatar} viewBox="0 0 24 24" fill="#757575"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.67 0-5.33-1.33-6.67-3.33.2-.8 3.96-2.02 6.67-2.02s6.47 1.22 6.67 2.02c-1.34 2-4 3.33-6.67 3.33z"></path></svg>);
const PaperclipIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v11.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path></svg>);
const SendIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>);

export default function ChatPage() {
    // Configuração da API
    const API_BASE_URL = 'http://localhost:5087';
    
    // Função para obter o token do localStorage
    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        }
        return null;
    };
    
    // Função para decodificar JWT e extrair userId
    const getUserIdFromToken = () => {
        const token = getAuthToken();
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.nameid; // ID do usuário no token
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    };

    // Estados
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isPolling, setIsPolling] = useState(true);
    
    const connectionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const lastMessageCountRef = useRef(0);

    // Carregar token ao montar o componente
    useEffect(() => {
        const token = getAuthToken();
        const userId = getUserIdFromToken();
        
        if (!token) {
            console.error('Token não encontrado. Usuário não autenticado.');
            // Redirecionar para login se necessário
            // window.location.href = '/login';
            return;
        }
        
        setAuthToken(token);
        setCurrentUserId(userId);
    }, []);

    // Scroll automático para última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Inicializar SignalR
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

        // Tentar múltiplos nomes de eventos possíveis
        const handleNewMessage = (message) => {
            console.log('🔔 Nova mensagem recebida via SignalR:', message);
            console.log('📌 Conversa ativa atual:', activeChat?.conversationId);
            console.log('📌 Conversa da mensagem:', message.conversationId);
            
            // Adicionar a nova mensagem diretamente
            setMessages(prevMessages => {
                console.log('📝 Mensagens anteriores:', prevMessages.length);
                // Evitar duplicatas
                const exists = prevMessages.some(m => m.id === message.id);
                if (exists) {
                    console.log('⚠️ Mensagem já existe, ignorando');
                    return prevMessages;
                }
                const newMessages = [...prevMessages, message];
                console.log('📝 Total de mensagens após adicionar:', newMessages.length);
                return newMessages;
            });
            
            // Atualizar lista de conversas
            console.log('🔄 Atualizando lista de conversas');
            setTimeout(() => fetchConversations(), 500);
        };

        // Registrar todos os eventos possíveis
        connection.on('ReceiveMessage', handleNewMessage);
        connection.on('NewMessage', handleNewMessage);
        connection.on('MessageReceived', handleNewMessage);
        connection.on('OnMessageReceived', handleNewMessage);

        connection.onreconnecting(() => {
            console.log('🔄 SignalR reconectando...');
        });

        connection.onreconnected(() => {
            console.log('✅ SignalR reconectado!');
            fetchConversations();
        });

        connection.onclose((error) => {
            console.log('❌ SignalR desconectado', error);
        });

        connection.start()
            .then(() => {
                console.log('✅ SignalR conectado com sucesso!');
                console.log('🔌 Connection ID:', connection.connectionId);
                connectionRef.current = connection;
            })
            .catch(err => {
                console.error('❌ Erro ao conectar SignalR:', err);
                // Tentar reconectar após 5 segundos
                setTimeout(() => {
                    console.log('🔄 Tentando reconectar...');
                    connection.start().catch(e => console.error('❌ Falha na reconexão:', e));
                }, 5000);
            });

        return () => {
            console.log('🔌 Desconectando SignalR...');
            connection.stop();
        };
    }, [authToken]);

    // Marcar mensagens como lidas
    const markAsRead = async (conversationId) => {
        const token = getAuthToken();
        if (!token) return;

        try {
            await fetch(`${API_BASE_URL}/api/Message/conversation/${conversationId}/mark-as-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            console.log('✅ Mensagens marcadas como lidas');
        } catch (error) {
            console.error('❌ Erro ao marcar mensagens como lidas:', error);
        }
    };

    // Buscar conversas
    const fetchConversations = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/Message/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            
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

    // Buscar mensagens de uma conversa
    const fetchMessages = async (conversationId, silent = false) => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/Message/conversation/${conversationId}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                if (!silent) {
                    console.log('📨 Mensagens carregadas:', data.length);
                }
                lastMessageCountRef.current = data.length;
            }
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
        }
    };

    // Enviar mensagem
    const sendMessage = async () => {
        if (!messageInput.trim() || !activeChat || sendingMessage) return;

        const token = getAuthToken();
        if (!token) return;

        setSendingMessage(true);
        const messageContent = messageInput;
        setMessageInput(''); // Limpar input imediatamente
        
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

            if (response.ok) {
                const sentMessage = await response.json();
                console.log('✅ Mensagem enviada com sucesso:', sentMessage);
                
                // Adicionar mensagem imediatamente (UI otimista)
                setMessages(prev => {
                    const exists = prev.some(m => m.id === sentMessage.id);
                    if (!exists) {
                        console.log('➕ Adicionando mensagem enviada à lista');
                        return [...prev, sentMessage];
                    }
                    console.log('⚠️ Mensagem já existe na lista');
                    return prev;
                });
                
                // Atualizar lista de conversas
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

    // Selecionar conversa
    const selectConversation = async (conversation) => {
        setActiveChat(conversation);
        await fetchMessages(conversation.conversationId);
        
        // Marcar mensagens como lidas
        if (conversation.unreadMessagesCount > 0) {
            await markAsRead(conversation.conversationId);
            // Atualizar lista de conversas para refletir contagem zerada
            fetchConversations();
        }
    };

    // Carregar conversas ao montar
    useEffect(() => {
        if (authToken) {
            fetchConversations();
        }
    }, [authToken]);

    // Polling para atualizar mensagens em tempo real (fallback se SignalR falhar)
    useEffect(() => {
        if (!activeChat || !isPolling) return;

        console.log('🔄 Iniciando polling para conversa:', activeChat.conversationId);
        
        // Verificar novas mensagens a cada 2 segundos
        pollingIntervalRef.current = setInterval(async () => {
            const token = getAuthToken();
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/Message/conversation/${activeChat.conversationId}/history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Só atualizar se houver mudanças
                    if (data.length !== lastMessageCountRef.current) {
                        console.log('🆕 Novas mensagens detectadas via polling!');
                        setMessages(data);
                        lastMessageCountRef.current = data.length;
                        
                        // Marcar como lida
                        markAsRead(activeChat.conversationId);
                        
                        // Atualizar lista de conversas
                        fetchConversations();
                    }
                }
            } catch (error) {
                console.error('Erro no polling:', error);
            }
        }, 2000); // Verifica a cada 2 segundos

        return () => {
            if (pollingIntervalRef.current) {
                console.log('🛑 Parando polling');
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [activeChat, isPolling]);

    // Formatar data
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
        <div className={styles.chatContainer}>
            {/* PAINEL DA ESQUERDA */}
            <div className={styles.contactList}>
                <div className={styles.contactListHeader}>
                    <div className={styles.contactListHeaderLeft}>
                        <span>Mensagens</span>
                        <ChevronDownIcon />
                        <span>{conversations.length}</span>
                    </div>
                    <div className={styles.plusIcon}>
                        <PlusIcon />
                    </div>
                </div>
                
                <div className={styles.searchBar}>
                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        placeholder="Pesquisar suas mensagens" 
                    />
                </div>
                
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
                                            marginBottom: '8px',
                                            padding: '0 16px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '60%',
                                                padding: '10px 14px',
                                                borderRadius: '18px',
                                                backgroundColor: isFromMe ? '#0084ff' : '#e4e6eb',
                                                color: isFromMe ? 'white' : 'black',
                                                wordWrap: 'break-word'
                                            }}
                                        >
                                            {msg.content}
                                            <div style={{
                                                fontSize: '11px',
                                                marginTop: '4px',
                                                opacity: 0.7
                                            }}>
                                                {new Date(msg.sentAt).toLocaleTimeString('pt-BR', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <PaperclipIcon className={styles.paperclipIcon} />
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
    );
}