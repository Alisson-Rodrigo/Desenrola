using Desenrola.Domain.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Domain.Entities
{
    public class Conversation : BaseEntity
    {
        // Relacionamento com os usuários da conversa
        public string? UserId1 { get; set; }
        public string? UserId2 { get; set; }

        // Propriedades de navegação para os usuários
        public virtual User User1 { get; set; } = null!;
        public virtual User User2 { get; set; } = null!;

        // Lista de mensagens relacionadas a essa conversa
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

        // Data e hora da criação da conversa
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
