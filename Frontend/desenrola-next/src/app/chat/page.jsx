// page.jsx (VERSÃO FINAL INTERATIVA)
'use client'; // Necessário para usar o useState no Next.js App Router

import { useState } from 'react'; // Importa o hook useState
import styles from './Chat.module.css';


// --- Ícones (sem alteração) ---
/**
 * Ícone de seta para baixo (ChevronDown).
 * @returns {JSX.Element}
 */
const ChevronDownIcon = () => (<svg height="16" viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M7 10l5 5 5-5z"></path></svg>);
/**
 * Ícone de adição (Plus).
 * @returns {JSX.Element}
 */
const PlusIcon = () => (<svg height="20" viewBox="0 0 24 24" width="20" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>);
/**
 * Ícone de avatar de usuário.
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
const UserAvatarIcon = ({ className }) => (<svg className={className || styles.avatar} viewBox="0 0 24 24" fill="#757575"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.67 0-5.33-1.33-6.67-3.33.2-.8 3.96-2.02 6.67-2.02s6.47 1.22 6.67 2.02c-1.34 2-4 3.33-6.67 3.33z"></path></svg>);
/**
 * Ícone de clipe de papel (Paperclip).
 * @returns {JSX.Element}
 */
const PaperclipIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v11.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"></path></svg>);
/**
 * Ícone de envio (Send).
 * @returns {JSX.Element}
 */
const SendIcon = () => (<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>);

/**
 * Página de chat interativo.
 * Exibe uma lista de contatos e uma janela de conversa.
 * Permite alternar entre diferentes usuários simulados e enviar mensagens (UI).
 * @component
 * @returns {JSX.Element}
 */
export default function ChatPage() {
    // MUDANÇA: Dados dos usuários
    /**
     * Usuários simulados para exibição na lista de contatos.
     */
    const users = {
        user1: { id: 1, name: 'Usuário', lastMessage: 'Última mensagem...', time: '24m' },
        user2: { id: 2, name: 'Usuário 2', lastMessage: 'Última mensagem...', time: '3h' }
    };

    // MUDANÇA: 'useState' para controlar qual chat está ativo. Começa com o user1.
    /**
     * Estado do chat ativo (usuário selecionado).
     */
    const [activeChat, setActiveChat] = useState(users.user1);

    return (

        
        <div className={styles.chatContainer}>
            {/* PAINEL DA ESQUERDA */}
            <div className={styles.contactList}>
                <div className={styles.contactListHeader}>
                    <div className={styles.contactListHeaderLeft}>
                        <span>Mensagens</span><ChevronDownIcon /><span>1</span>
                    </div>
                    <div className={styles.plusIcon}><PlusIcon /></div>
                </div>
                <div className={styles.searchBar}>
                    <input type="text" className={styles.searchInput} placeholder="Pesquisar suas mensagens" />
                </div>
                
                {/* MUDANÇA: Lista de usuários agora é dinâmica */}
                {Object.values(users).map(user => (
                    <div 
                        key={user.id}
                        // Aplica a classe 'active' se o ID do usuário for o mesmo do chat ativo
                        className={`${styles.contactItem} ${activeChat.id === user.id ? styles.active : ''}`}
                        // Ao clicar, muda o estado para o usuário clicado
                        onClick={() => setActiveChat(user)}
                    >
                        <UserAvatarIcon />
                        <div className={styles.contactItemInfo}>
                            <h3>{user.name}</h3>
                            <p>{user.lastMessage}</p>
                        </div>
                        <span className={styles.contactItemTime}>{user.time}</span>
                    </div>
                ))}
            </div>

            {/* PAINEL DA DIREITA */}
            <div className={styles.chatWindow}>
                <div className={styles.chatHeader}>
                    <UserAvatarIcon />
                    <div className={styles.chatHeaderInfo}>
                        {/* MUDANÇA: Mostra o nome do usuário que está no estado 'activeChat' */}
                        <h3>{activeChat.name}</h3>
                        <p>Online</p>
                    </div>
                </div>
                
                <div className={styles.messagesContainer}>{/* VAZIO */}</div>

                <div className={styles.inputArea}>
                    <PaperclipIcon className={styles.paperclipIcon} />
                    <input type="text" placeholder="Escreva sua mensagem" className={styles.textInput} />
                    <button className={styles.sendButton}><SendIcon /></button>
                </div>
            </div>
        </div>
    );
}