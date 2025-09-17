import React from 'react';
import styles from './Chat.module.css';
import { FiPlus, FiSmile, FiSend } from 'react-icons/fi';

/**
 * Componente interno: ContactList
 * -------------------------------
 * - Lista de contatos do chat.
 * - Cada contato exibe:
 *    - Avatar
 *    - Nome
 *    - Última mensagem
 *    - Horário da última mensagem
 *    - Estado ativo (destacado visualmente)
 * - Barra de pesquisa ainda sem lógica funcional.
 * - Ícone de "+" permite adicionar novo contato (sem funcionalidade ainda).
 */
const ContactList = () => {
  const contacts = [
    {
      name: 'Nome do Contato',
      lastMessage: 'Última mensagem...',
      time: '10:45',
      avatar: 'https://i.pravatar.cc/150?img=12',
      active: true,
    },
  ];

  return (
    <div className={styles.contactList}>
      <div className={styles.contactHeader}>
        <h2>Mensagens</h2>
        <FiPlus />
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Pesquisar ou começar uma nova conversa" />
      </div>
      <div>
        {contacts.map((contact, index) => (
          <div key={index} className={`${styles.contactItem} ${contact.active ? styles.active : ''}`}>
            <img src={contact.avatar} alt={contact.name} className={styles.avatar} />
            <div className={styles.contactInfo}>
              <div className={styles.contactInfoTop}>
                <h3>{contact.name}</h3>
                <span>{contact.time}</span>
              </div>
              <p>{contact.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente interno: ChatWindow
 * ------------------------------
 * - Janela de chat com um contato específico.
 * - Cabeçalho mostra avatar, nome e status do contato.
 * - Área de mensagens (atualmente vazia) mostra bolhas de mensagens:
 *    - 'me' => mensagem enviada pelo usuário
 *    - 'other' => mensagem recebida
 * - Avatares aparecem ao lado das mensagens.
 * - Área de input permite digitar nova mensagem com ícones de emoji e enviar.
 */
const ChatWindow = () => {
  const chatMessages = [];
  
  const contact = {
    name: 'Nome do Contato',
    status: 'Online',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img src={contact.avatar} alt={contact.name} className={styles.avatar} />
        <div className={styles.chatHeaderInfo}>
          <h3>{contact.name}</h3>
          <p>{contact.status}</p>
        </div>
      </div>
      <div className={styles.messagesContainer}>
        {chatMessages.map((msg, index) => (
          <div key={index} className={`${styles.messageWrapper} ${msg.sender === 'me' ? styles.sentWrapper : styles.receivedWrapper}`}>
            {msg.sender === 'other' && <img src={contact.avatar} alt="avatar" className={styles.messageSenderAvatar} />}
            <div className={styles.messageBubble}>
              {msg.text}
            </div>
            {msg.sender === 'me' && <img src="https://i.pravatar.cc/150?img=3" alt="my avatar" className={styles.messageSenderAvatar} />}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <FiSmile />
        <input type="text" placeholder="Digite uma mensagem" />
        <button className={styles.sendButton}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

/**
 * Componente principal: Chat
 * --------------------------
 * - Junta ContactList e ChatWindow no layout do chat.
 * - Usa `styles.chatContainer` para organizar os dois componentes lado a lado.
 */
const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      <ContactList />
      <ChatWindow />
    </div>
  );
};

export default Chat;
