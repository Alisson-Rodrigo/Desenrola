using Desenrola.Domain.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Domain.Entities
{
    public class Message : BaseEntity
    {
        // Relacionamento com a conversa
        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; } = null!;

        // Relacionamento com o usuário que enviou a mensagem
        public string? SenderId { get; set; }
        public virtual User Sender { get; set; } = null!;

        // Conteúdo da mensagem
        public string Content { get; set; } = string.Empty;

        // Data e hora de envio
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Status de leitura da mensagem
        public bool IsRead { get; set; } = false;

        // Data de leitura
        public DateTime? ReadAt { get; set; }
    }
}
