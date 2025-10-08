'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';

// --- Ícones ---
const ChevronDownIcon = () => (<svg height="16" viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg>);
const PlusIcon = () => (<svg height="20" viewBox="0 0 24 24" width="20" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>);
const UserAvatarIcon = ({ className, src, name }) => {
    if (src) {
        return <img src={src} alt={name} className={className || styles.avatar} style={{ borderRadius: '50%', objectFit: 'cover', width: '40px', height: '40px' }} />;
    }
    return (
        <svg className={className || styles.avatar} viewBox="0 0 24 24" fill="#757575">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.67 0-5.33-1.33-6.67-3.33.2-.8 3.96-2.02 6.67-2.02s6.47 1.22 6.67 2.02c-1.34 2-4 3.33-6.67 3.33z"></path>
        </svg>
    );
};
const PaperclipIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v11.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path></svg>);
const SendIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>);

export default function ChatPage() {
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const receiverIdFromUrl = searchParams.get('receiverId');

    // Estados
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [totalUnread, setTotalUnread] = useState(0);
    
    // Ref para scroll automático
    const messagesEndRef = useRef(null);

    /**
     * Atualiza o título da página com contador de não lidas
     */
    useEffect(() => {
        const total = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        setTotalUnread(total);
        
        if (typeof document !== 'undefined') {
            document.title = total > 0 ? `(${total}) Mensagens - Chat` : 'Chat - Mensagens';
        }
    }, [conversations]);

    /**
     * Decodifica o token JWT
     */
    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('❌ Erro ao decodificar token:', e);
            return null;
        }
    };

    /**
     * Verifica autenticação
     */
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("auth_token");
            setIsAuthenticated(!!token);
            
            if (token) {
                const decoded = decodeToken(token);
                if (decoded && decoded.nameid) {
                    setCurrentUserId(decoded.nameid);
                    console.log('👤 Current User ID:', decoded.nameid);
                }
            }
            
            setIsCheckingAuth(false);
        }
    }, []);

    /**
     * Busca conversas
     */
    useEffect(() => {
        const fetchConversations = async () => {
            setLoadingConversations(true);
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    setLoadingConversations(false);
                    return;
                }

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                console.log('📥 Buscando conversas...');
                const response = await fetch(
                    'http://localhost:5087/api/Message/conversations',
                    { method: 'GET', headers }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Conversas recebidas:', data);
                    
                    const formattedConversations = data.map(conv => ({
                        conversationId: conv.conversationId,
                        userId: conv.otherUserId,
                        userName: conv.otherUserName,
                        profilePicture: conv.otherUserProfilePicture,
                        lastMessage: conv.lastMessage,
                        timestamp: conv.lastMessageDate,
                        unreadCount: conv.unreadMessagesCount,
                        isLastMessageFromMe: conv.isLastMessageFromMe
                    }));
                    
                    if (receiverIdFromUrl) {
                        console.log('🎯 receiverId detectado na URL:', receiverIdFromUrl);
                        await fetchProviderData(receiverIdFromUrl, formattedConversations);
                    } else {
                        setConversations(formattedConversations);
                        if (formattedConversations.length > 0) {
                            setActiveChat(formattedConversations[0]);
                        }
                    }
                } else if (response.status === 401) {
                    localStorage.removeItem("auth_token");
                    window.location.href = '/login';
                }
            } catch (err) {
                console.error('❌ Erro ao buscar conversas:', err);
            } finally {
                setLoadingConversations(false);
            }
        };

        if (isAuthenticated && !isCheckingAuth) {
            fetchConversations();
        }
    }, [receiverIdFromUrl, isAuthenticated, isCheckingAuth]);

    /**
     * Busca dados do prestador
     */
    const fetchProviderData = async (providerId, existingConversations = []) => {
        try {
            const token = localStorage.getItem("auth_token");
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            console.log('🔍 Buscando dados do prestador:', providerId);

            const response = await fetch(
                `http://localhost:5087/api/provider/profile/specify?Id=${providerId}`,
                { method: 'GET', headers }
            );

            console.log('📡 Status da resposta:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dados do prestador:', data);
                
                // Verifica se já existe conversa
                const existingConv = existingConversations.find(conv => conv.userId === data.userId);
                
                if (existingConv) {
                    console.log('💬 Conversa já existe, selecionando...');
                    setConversations(existingConversations);
                    setActiveChat(existingConv);
                } else {
                    console.log('🆕 Nova conversa detectada (mensagem já foi enviada do ProfilePage)');
                    // Aguarda um pouco para a conversa aparecer na lista
                    setTimeout(async () => {
                        // Recarrega as conversas para pegar a nova
                        const reloadResponse = await fetch(
                            'http://localhost:5087/api/Message/conversations',
                            { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
                        );
                        
                        if (reloadResponse.ok) {
                            const reloadData = await reloadResponse.json();
                            const formattedConversations = reloadData.map(conv => ({
                                conversationId: conv.conversationId,
                                userId: conv.otherUserId,
                                userName: conv.otherUserName,
                                profilePicture: conv.otherUserProfilePicture,
                                lastMessage: conv.lastMessage,
                                timestamp: conv.lastMessageDate,
                                unreadCount: conv.unreadMessagesCount,
                                isLastMessageFromMe: conv.isLastMessageFromMe
                            }));
                            
                            setConversations(formattedConversations);
                            
                            // Encontra a conversa com o prestador
                            const newConv = formattedConversations.find(conv => conv.userId === data.userId);
                            if (newConv) {
                                setActiveChat(newConv);
                            }
                        }
                    }, 1000); // Aguarda 1 segundo
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Erro ao buscar prestador:', response.status, errorText);
                setConversations(existingConversations);
                setError('Não foi possível carregar os dados do prestador.');
            }
        } catch (err) {
            console.error('❌ Erro ao buscar prestador:', err);
            setConversations(existingConversations);
            setError('Erro ao conectar com o servidor.');
        }
    };

    /**
     * Busca mensagens
     */
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeChat) return;

            if (!activeChat.conversationId) {
                setLoadingMessages(false);
                return;
            }

            // Só mostra loading na primeira vez
            if (messages.length === 0) {
                setLoadingMessages(true);
            }

            try {
                const token = localStorage.getItem("auth_token");
                if (!token) return;

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const response = await fetch(
                    `http://localhost:5087/api/Message/conversation/${activeChat.conversationId}/history`,
                    { method: 'GET', headers }
                );

                if (response.ok) {
                    const data = await response.json();
                    
                    // Verifica se há novas mensagens
                    if (data.length > lastMessageCount) {
                        console.log('📨 Nova mensagem recebida!');
                        
                        // Toca um som de notificação (opcional)
                        // new Audio('/notification.mp3').play().catch(() => {});
                    }
                    
                    setLastMessageCount(data.length);
                    
                    // Verifica se há novas mensagens antes de atualizar
                    if (JSON.stringify(data) !== JSON.stringify(messages)) {
                        setMessages(data);
                        
                        // Scroll suave para o final
                        setTimeout(() => {
                            if (messagesEndRef.current) {
                                messagesEndRef.current.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'end' 
                                });
                            }
                        }, 100);
                    }
                    
                    // Marca como lidas se houver mensagens não lidas
                    if (activeChat.unreadCount > 0) {
                        markAsRead(activeChat.conversationId);
                    }
                }
            } catch (err) {
                console.error('❌ Erro ao buscar mensagens:', err);
            } finally {
                setLoadingMessages(false);
            }
        };

        // Busca imediatamente
        fetchMessages();
        
        // Polling: atualiza mensagens a cada 2 segundos (REMOVIDO messages das dependências)
        const messagesInterval = setInterval(fetchMessages, 2000);
        
        return () => clearInterval(messagesInterval);
    }, [activeChat]); // Removido 'messages' das dependências

    // --- INÍCIO DA ALTERAÇÃO ---
    /**
     * Hook para polling da lista de conversas
     * (Mantém a barra lateral atualizada para novas mensagens recebidas)
     */
    useEffect(() => {
        const pollConversations = async () => {
            // Garante que não executa antes da autenticação
            const token = localStorage.getItem("auth_token");
            if (!isAuthenticated || isCheckingAuth || !token) return;

            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                const response = await fetch('http://localhost:5087/api/Message/conversations', { method: 'GET', headers });

                if (response.ok) {
                    const data = await response.json();
                    const updatedConversations = data.map(conv => ({
                        conversationId: conv.conversationId,
                        userId: conv.otherUserId,
                        userName: conv.otherUserName,
                        profilePicture: conv.otherUserProfilePicture,
                        lastMessage: conv.lastMessage,
                        timestamp: conv.lastMessageDate,
                        unreadCount: conv.unreadMessagesCount,
                        isLastMessageFromMe: conv.isLastMessageFromMe
                    }));
                    
                    // Atualiza a lista de conversas no estado
                    setConversations(updatedConversations);

                    // Sincroniza o 'activeChat' para que ele também seja atualizado.
                    // Isso é importante para que o contador de não lidas no chat ativo desapareça.
                    if (activeChat) {
                        const refreshedActiveChat = updatedConversations.find(
                            c => c.conversationId === activeChat.conversationId
                        );
                        
                        if (refreshedActiveChat) {
                           setActiveChat(refreshedActiveChat);
                        }
                    }
                }
            } catch (err) {
                // Exibe o erro no console sem interromper a experiência do usuário
                console.error("❌ Erro no polling de conversas:", err);
            }
        };

        // Define o intervalo para buscar atualizações a cada 5 segundos
        const intervalId = setInterval(pollConversations, 5000);

        // Limpa o intervalo quando o componente for "desmontado" para evitar vazamento de memória
        return () => clearInterval(intervalId);

    }, [isAuthenticated, isCheckingAuth, activeChat]); // Dependências para acessar os valores mais recentes
    // --- FIM DA ALTERAÇÃO ---

    /**
     * Marca mensagens como lidas
     */
    const markAsRead = async (conversationId) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            console.log('✅ Marcando mensagens como lidas:', conversationId);

            await fetch(
                `http://localhost:5087/api/Message/conversation/${conversationId}/mark-as-read`,
                { method: 'PUT', headers }
            );

            // Atualiza localmente para feedback imediato
            setConversations(prev => prev.map(conv => 
                conv.conversationId === conversationId 
                    ? { ...conv, unreadCount: 0 }
                    : conv
            ));

            if (activeChat?.conversationId === conversationId) {
                setActiveChat(prev => ({ ...prev, unreadCount: 0 }));
            }
        } catch (err) {
            console.error('❌ Erro ao marcar como lida:', err);
        }
    };

    /**
     * Envia mensagem
     */
    const sendMessage = async () => {
        if (!messageText.trim()) return;

        const token = localStorage.getItem("auth_token");
        if (!token) {
            setError('Você precisa estar autenticado para enviar mensagens.');
            return;
        }

        console.log('📤 Enviando mensagem para:', activeChat.userId);

        setIsSending(true);
        setError(null);

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch('http://localhost:5087/api/Message/send', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    receiverId: activeChat.userId,
                    content: messageText
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("auth_token");
                    setError('Sua sessão expirou. Por favor, faça login novamente.');
                    setTimeout(() => {
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }, 2000);
                    return;
                }
                throw new Error(`Erro ao enviar mensagem: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Mensagem enviada:', data);
            
            const newMessage = {
                id: data.id || Date.now(),
                conversationId: data.conversationId || activeChat.conversationId,
                senderId: currentUserId,
                senderName: 'Você',
                content: messageText,
                sentAt: new Date().toISOString(),
                isRead: false
            };
            
            setMessages([...messages, newMessage]);

            // Scroll para o final após enviar
            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'end' 
                    });
                }
            }, 100);

            setConversations(prev => prev.map(conv => 
                conv.userId === activeChat.userId 
                    ? { 
                        ...conv, 
                        lastMessage: messageText, 
                        timestamp: new Date().toISOString(), 
                        isNew: false,
                        conversationId: data.conversationId || conv.conversationId
                    }
                    : conv
            ));

            if (activeChat.isNew) {
                setActiveChat({ 
                    ...activeChat, 
                    isNew: false,
                    conversationId: data.conversationId || activeChat.conversationId
                });
            }

            setMessageText('');
            
        } catch (err) {
            console.error('❌ Erro ao enviar mensagem:', err);
            setError('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setIsSending(false);
        }
    };

    /**
     * Formata timestamp
     */
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return minutes <= 1 ? 'agora' : `${minutes}m`;
        }
        
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}h`;
        }
        
        const days = Math.floor(diff / 86400000);
        return `${days}d`;
    };

    /**
     * Formata horário da mensagem
     */
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    /**
     * Manipula Enter
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (isCheckingAuth) {
        return (
            <div className={styles.chatContainer}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.chatContainer}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                    <p>Você precisa estar autenticado para acessar o chat.</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chatContainer}>
            {/* PAINEL ESQUERDO - LISTA DE CONVERSAS */}
            <div className={styles.contactList}>
                <div className={styles.contactListHeader}>
                    <div className={styles.contactListHeaderLeft}>
                        <span>Mensagens</span>
                        <ChevronDownIcon />
                        <span>{conversations.length}</span>
                        {totalUnread > 0 && (
                            <span style={{
                                marginLeft: '8px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                borderRadius: '10px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {totalUnread}
                            </span>
                        )}
                    </div>
                    <div className={styles.plusIcon}><PlusIcon /></div>
                </div>
                <div className={styles.searchBar}>
                    <input type="text" className={styles.searchInput} placeholder="Pesquisar suas mensagens" />
                </div>
                
                {loadingConversations ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p>Carregando conversas...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        <p>Nenhuma conversa ainda</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div 
                            key={conv.userId}
                            className={`${styles.contactItem} ${activeChat?.userId === conv.userId ? styles.active : ''}`}
                            onClick={() => {
                                setActiveChat(conv);
                                setError(null);
                            }}
                        >
                            <UserAvatarIcon src={conv.profilePicture} name={conv.userName} />
                            <div className={styles.contactItemInfo}>
                                <h3 style={{ fontWeight: conv.unreadCount > 0 ? 'bold' : 'normal' }}>
                                    {conv.userName}
                                </h3>
                                <p style={{ 
                                    fontWeight: conv.unreadCount > 0 ? '600' : 'normal',
                                    color: conv.unreadCount > 0 ? '#1976d2' : '#666'
                                }}>
                                    {conv.isLastMessageFromMe && 'Você: '}
                                    {conv.lastMessage || 'Sem mensagens'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                <span className={styles.contactItemTime}>{formatTime(conv.timestamp)}</span>
                                {conv.unreadCount > 0 && (
                                    <span style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '10px',
                                        padding: '2px 6px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        minWidth: '18px',
                                        textAlign: 'center'
                                    }}>
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* PAINEL DIREITO - CHAT */}
            <div className={styles.chatWindow}>
                {activeChat ? (
                    <>
                        <div className={styles.chatHeader}>
                            <UserAvatarIcon src={activeChat.profilePicture} name={activeChat.userName} />
                            <div className={styles.chatHeaderInfo}>
                                <h3>{activeChat.userName}</h3>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        backgroundColor: '#10b981',
                                        display: 'inline-block'
                                    }}></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        
                        <div className={styles.messagesContainer}>
                            {loadingMessages ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <p>Carregando mensagens...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                                    <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Nenhuma mensagem ainda</h3>
                                    <p style={{ margin: 0 }}>Carregando conversa...</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMyMessage = msg.senderId === currentUserId;
                                    return (
                                        <div key={msg.id} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                                            margin: '8px 16px'
                                        }}>
                                            <div style={{
                                                padding: '10px 14px',
                                                backgroundColor: isMyMessage ? '#1976d2' : '#e3f2fd',
                                                color: isMyMessage ? 'white' : '#000',
                                                borderRadius: '12px',
                                                maxWidth: '70%',
                                                wordWrap: 'break-word',
                                                position: 'relative',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}>
                                                {msg.content}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '11px',
                                                color: '#999',
                                                marginTop: '4px',
                                                marginLeft: isMyMessage ? '0' : '8px',
                                                marginRight: isMyMessage ? '8px' : '0'
                                            }}>
                                                <span>{formatMessageTime(msg.sentAt)}</span>
                                                {isMyMessage && msg.isRead && (
                                                    <span style={{ color: '#10b981' }}>✓✓</span>
                                                )}
                                                {isMyMessage && !msg.isRead && (
                                                    <span style={{ color: '#999' }}>✓</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            
                            {/* Referência para scroll automático */}
                            <div ref={messagesEndRef} />
                            
                            {error && (
                                <div style={{
                                    padding: '10px',
                                    margin: '8px',
                                    backgroundColor: '#ffebee',
                                    color: '#c62828',
                                    borderRadius: '8px',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className={styles.inputArea}>
                            <PaperclipIcon className={styles.paperclipIcon} />
                            <input 
                                type="text" 
                                placeholder="Escreva sua mensagem" 
                                className={styles.textInput}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSending}
                            />
                            <button 
                                className={styles.sendButton}
                                onClick={sendMessage}
                                disabled={isSending || !messageText.trim()}
                                style={{
                                    opacity: isSending || !messageText.trim() ? 0.5 : 1,
                                    cursor: isSending || !messageText.trim() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSending ? '...' : <SendIcon />}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: '#666'
                    }}>
                        <p>Selecione uma conversa para começar</p>
                    </div>
                )}
            </div>
        </div>
    );
}