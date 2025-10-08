using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Domain.Communication
{
    public class ResponseSendMessageCommunication
    {
        public int Id { get; set; }               // ID da mensagem
        public int ConversationId { get; set; }    // ID da conversa
        public int SenderId { get; set; }         // ID do remetente
        public string SenderName { get; set; }     // Nome do remetente
        public string Message { get; set; }        // Conteúdo da mensagem
        public DateTime Created { get; set; }      // Data de envio da mensagem
        public bool IsRead { get; set; }           // Status da mensagem (lida ou não)
        public DateTime? ReadAt { get; set; } // Nova propriedade

    }
}
