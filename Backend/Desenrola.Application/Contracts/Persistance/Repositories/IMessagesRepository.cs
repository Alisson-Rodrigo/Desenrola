using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IMessagesRepository  // Torne a interface pública
    {
        Task AddMessage(Message message);
        Task<List<Message>> GetMessagesByConversationId(Guid conversationId);
        Task<Message?> GetLastMessageByConversationId(Guid conversationId);
        Task<int> GetUnreadMessagesCount(Guid conversationId, string userId);
        Task MarkMessagesAsReadByConversation(Guid conversationId, string userId);
        Task MarkMessageAsRead(int messageId);
        Task<int> GetTotalUnreadMessagesCount(string userId);

    }
}
