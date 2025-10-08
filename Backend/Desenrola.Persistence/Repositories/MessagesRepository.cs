using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Persistence.Repositories
{
    public class MessagesRepository : IMessagesRepository, IConversationRepository
    {
        private readonly DefaultContext _context;

        public MessagesRepository(DefaultContext context)
        {
            _context = context;
        }

        public async Task AddMessage(Message message)
        {
            await _context.Messages.AddAsync(message);
        }

        // Obter conversa entre dois usuários
        public async Task<Conversation> GetConversationByUsers(string userId1, string userId2)
        {
            return await _context.Conversations
                .FirstOrDefaultAsync(c => (c.UserId1 == userId1 && c.UserId2 == userId2) ||
                                          (c.UserId1 == userId2 && c.UserId2 == userId1));
        }

        // Adicionar nova conversa
        public async Task AddConversation(Conversation conversation)
        {
            await _context.Conversations.AddAsync(conversation);
        }

        public async Task<List<Message>> GetMessagesByConversationId(Guid conversationId)
        {
            try
            {
                var messages = await _context.Messages
                    .Where(m => m.Conversation.Id == conversationId) // Filtra pela ConversationId
                    .Include(m => m.Sender) // Inclui os detalhes do usuário que enviou a mensagem
                    .OrderBy(m => m.CreatedOn) // Ordena as mensagens pela data de envio
                    .ToListAsync(); // Retorna as mensagens de forma assíncrona

                return messages;
            }
            catch (Exception ex)
            {
                // Log de erro ou manipulação adicional de exceção
                throw new Exception("Erro ao recuperar as mensagens da conversa: " + ex.Message);
            }
        }

        // ConversationRepository.cs
        public async Task<Conversation> GetConversationByConversationId(Guid conversationId)
        {
            return await _context.Conversations
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }

        public async Task<List<Conversation>> GetConversationsUser(string userId)
        {
            return await _context.Conversations
                .Where(x => x.UserId1 == userId || x.UserId2 == userId)
                .ToListAsync();
        }

        public async Task<Message?> GetLastMessageByConversationId(Guid conversationId)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderByDescending(m => m.CreatedOn)
                .FirstOrDefaultAsync();
        }

        public async Task<int> GetUnreadMessagesCount(Guid conversationId, string userId)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId &&
                           m.SenderId != userId &&
                           !m.IsRead)
                .CountAsync();
        }

        // Implementação dos métodos no MessagesRepository

        public async Task MarkMessagesAsReadByConversation(Guid conversationId, string userId)
        {
            var unreadMessages = await _context.Messages
                .Where(m => m.ConversationId == conversationId &&
                           m.SenderId != userId &&
                           !m.IsRead)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow; // Adicionar este campo ao modelo se não existir
            }

            _context.Messages.UpdateRange(unreadMessages);
        }

        public async Task<int> GetTotalUnreadMessagesCount(string userId)
        {
            // Buscar todas as conversas do usuário
            var userConversations = await _context.Conversations
                .Where(c => c.UserId1 == userId || c.UserId2 == userId)
                .Select(c => c.Id)
                .ToListAsync();

            // Contar mensagens não lidas nessas conversas (excluindo as enviadas pelo próprio usuário)
            return await _context.Messages
                .Where(m => userConversations.Contains(m.ConversationId) &&
                           m.SenderId != userId &&
                           !m.IsRead)
                .CountAsync();
        }

        public async Task MarkMessageAsRead(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message != null)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.Now;
                _context.Messages.Update(message);
            }
        }

    }
}
