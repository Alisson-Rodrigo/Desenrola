    public class SendMessageCommunication
    {
        public Guid ConversationId { get; set; }   // ID da conversa (Guid!)
        public string ReceiverId { get; set; } = string.Empty; // ID do destinatário
        public string Content { get; set; } = string.Empty;    // Conteúdo da mensagem
    }