using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IConversationRepository
    {
        Task<Conversation> GetConversationByUsers(string userId1, string userId2);
        Task AddConversation(Conversation conversation);
        Task<Conversation> GetConversationByConversationId(Guid conversationId);
        Task<List<Conversation>> GetConversationsUser(string userId);
    }
}
