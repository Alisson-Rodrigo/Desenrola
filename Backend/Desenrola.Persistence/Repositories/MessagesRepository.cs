using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Desenrola.Persistence.Repositories
{
    /// <summary>
    /// Repositório responsável pelo gerenciamento de mensagens e conversas entre usuários.
    /// Implementa as interfaces <see cref="IMessagesRepository"/> e <see cref="IConversationRepository"/>.
    /// </summary>
    public class MessagesRepository : IMessagesRepository, IConversationRepository
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova instância do repositório de mensagens.
        /// </summary>
        /// <param name="context">Instância do contexto de banco de dados padrão (<see cref="DefaultContext"/>).</param>
        public MessagesRepository(DefaultContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Adiciona uma nova mensagem ao banco de dados.
        /// </summary>
        /// <param name="message">Objeto <see cref="Message"/> representando a mensagem a ser salva.</param>
        public async Task AddMessage(Message message)
        {
            await _context.Messages.AddAsync(message);
        }

        /// <summary>
        /// Obtém a conversa existente entre dois usuários.
        /// </summary>
        /// <param name="userId1">Identificador do primeiro usuário.</param>
        /// <param name="userId2">Identificador do segundo usuário.</param>
        /// <returns>
        /// Retorna o objeto <see cref="Conversation"/> se existir uma conversa entre os usuários;
        /// caso contrário, retorna <c>null</c>.
        /// </returns>
        public async Task<Conversation> GetConversationByUsers(string userId1, string userId2)
        {
            return await _context.Conversations
                .FirstOrDefaultAsync(c => (c.UserId1 == userId1 && c.UserId2 == userId2) ||
                                          (c.UserId1 == userId2 && c.UserId2 == userId1));
        }

        /// <summary>
        /// Adiciona uma nova conversa entre dois usuários.
        /// </summary>
        /// <param name="conversation">Objeto <see cref="Conversation"/> representando a nova conversa.</param>
        public async Task AddConversation(Conversation conversation)
        {
            await _context.Conversations.AddAsync(conversation);
        }

        /// <summary>
        /// Obtém todas as mensagens associadas a uma conversa específica.
        /// </summary>
        /// <param name="conversationId">Identificador único da conversa (<see cref="Guid"/>).</param>
        /// <returns>
        /// Retorna uma lista de objetos <see cref="Message"/> ordenadas pela data de criação.
        /// </returns>
        /// <exception cref="Exception">Lançada se ocorrer um erro ao recuperar as mensagens.</exception>
        public async Task<List<Message>> GetMessagesByConversationId(Guid conversationId)
        {
            try
            {
                var messages = await _context.Messages
                    .Where(m => m.Conversation.Id == conversationId)
                    .Include(m => m.Sender)
                    .OrderBy(m => m.CreatedOn)
                    .ToListAsync();

                return messages;
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao recuperar as mensagens da conversa: " + ex.Message);
            }
        }

        /// <summary>
        /// Obtém uma conversa com base no seu identificador único.
        /// </summary>
        /// <param name="conversationId">Identificador único da conversa (<see cref="Guid"/>).</param>
        /// <returns>Retorna o objeto <see cref="Conversation"/> correspondente, ou <c>null</c> se não encontrado.</returns>
        public async Task<Conversation> GetConversationByConversationId(Guid conversationId)
        {
            return await _context.Conversations
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }

        /// <summary>
        /// Obtém todas as conversas associadas a um usuário.
        /// </summary>
        /// <param name="userId">Identificador do usuário.</param>
        /// <returns>Retorna uma lista de conversas (<see cref="Conversation"/>) onde o usuário participa.</returns>
        public async Task<List<Conversation>> GetConversationsUser(string userId)
        {
            return await _context.Conversations
                .Where(x => x.UserId1 == userId || x.UserId2 == userId)
                .ToListAsync();
        }

        /// <summary>
        /// Obtém a última mensagem enviada em uma conversa específica.
        /// </summary>
        /// <param name="conversationId">Identificador da conversa (<see cref="Guid"/>).</param>
        /// <returns>
        /// Retorna a última mensagem (<see cref="Message"/>) da conversa,
        /// ou <c>null</c> se não houver mensagens.
        /// </returns>
        public async Task<Message?> GetLastMessageByConversationId(Guid conversationId)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderByDescending(m => m.CreatedOn)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Conta o número de mensagens não lidas em uma conversa, enviadas por outro usuário.
        /// </summary>
        /// <param name="conversationId">Identificador da conversa (<see cref="Guid"/>).</param>
        /// <param name="userId">Identificador do usuário autenticado.</param>
        /// <returns>Retorna o número de mensagens não lidas.</returns>
        public async Task<int> GetUnreadMessagesCount(Guid conversationId, string userId)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId &&
                           m.SenderId != userId &&
                           !m.IsRead)
                .CountAsync();
        }

        /// <summary>
        /// Marca todas as mensagens de uma conversa como lidas, exceto as enviadas pelo próprio usuário.
        /// </summary>
        /// <param name="conversationId">Identificador da conversa (<see cref="Guid"/>).</param>
        /// <param name="userId">Identificador do usuário que está lendo as mensagens.</param>
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
                message.ReadAt = DateTime.UtcNow;
            }

            _context.Messages.UpdateRange(unreadMessages);
        }

        /// <summary>
        /// Obtém o total de mensagens não lidas em todas as conversas de um usuário.
        /// </summary>
        /// <param name="userId">Identificador do usuário autenticado.</param>
        /// <returns>Retorna o número total de mensagens não lidas.</returns>
        public async Task<int> GetTotalUnreadMessagesCount(string userId)
        {
            var userConversations = await _context.Conversations
                .Where(c => c.UserId1 == userId || c.UserId2 == userId)
                .Select(c => c.Id)
                .ToListAsync();

            return await _context.Messages
                .Where(m => userConversations.Contains(m.ConversationId) &&
                           m.SenderId != userId &&
                           !m.IsRead)
                .CountAsync();
        }

        /// <summary>
        /// Marca uma mensagem individual como lida.
        /// </summary>
        /// <param name="messageId">Identificador da mensagem.</param>
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
