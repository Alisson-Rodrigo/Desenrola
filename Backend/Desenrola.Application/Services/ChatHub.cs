using Desenrola.Domain.Communication;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Desenrola.Application.Services
{
    public class ChatHub : Hub
    {
        /// <summary>
        /// Adiciona o cliente ao grupo de uma conversa
        /// </summary>
        /// <param name="conversationId">ID da conversa</param>
        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);

            // Opcional: notificar outros que o usuário entrou
            await Clients.Group(conversationId).SendAsync("UserJoinedConversation", new
            {
                ConnectionId = Context.ConnectionId,
                ConversationId = conversationId
            });
        }

        /// <summary>
        /// Remove o cliente do grupo da conversa
        /// </summary>
        /// <param name="conversationId">ID da conversa</param>
        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);

            // Opcional: notificar outros que o usuário saiu
            await Clients.Group(conversationId).SendAsync("UserLeftConversation", new
            {
                ConnectionId = Context.ConnectionId,
                ConversationId = conversationId
            });
        }

        /// <summary>
        /// Método para enviar mensagem diretamente pelo Hub (opcional)
        /// Mantido para compatibilidade, mas recomenda-se usar a controller
        /// </summary>
        /// <param name="messageData">Dados da mensagem</param>
        public async Task SendMessageToGroup(ResponseSendMessageCommunication messageData)
        {
            await Clients.Group(messageData.ConversationId.ToString()).SendAsync("ReceiveMessage", messageData);
        }

        /// <summary>
        /// Notifica que um usuário está digitando
        /// </summary>
        /// <param name="conversationId">ID da conversa</param>
        /// <param name="userName">Nome do usuário</param>
        public async Task NotifyTyping(string conversationId, string userName)
        {
            await Clients.OthersInGroup(conversationId).SendAsync("UserTyping", new
            {
                ConversationId = conversationId,
                UserName = userName,
                IsTyping = true
            });
        }

        /// <summary>
        /// Notifica que um usuário parou de digitar
        /// </summary>
        /// <param name="conversationId">ID da conversa</param>
        /// <param name="userName">Nome do usuário</param>
        public async Task NotifyStoppedTyping(string conversationId, string userName)
        {
            await Clients.OthersInGroup(conversationId).SendAsync("UserTyping", new
            {
                ConversationId = conversationId,
                UserName = userName,
                IsTyping = false
            });
        }

        /// <summary>
        /// Evento quando cliente se conecta
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            // Você pode adicionar lógica aqui se necessário
            // Por exemplo, salvar a conexão em cache
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Evento quando cliente se desconecta
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Limpar recursos se necessário
            await base.OnDisconnectedAsync(exception);
        }
    }
}
