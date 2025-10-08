using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Services;
using Desenrola.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Desenrola.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessagesRepository _messageRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IHubContext<ChatHub> _chatHubContext;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly ILogged _loggedUserService;

        public MessageController(
            IMessagesRepository messageRepository,
            IConversationRepository conversationRepository,
            IHubContext<ChatHub> chatHubContext,
            IUnitOfWork unitOfWork,
            IUserRepository userRepository,
            ILogged loggedUserService)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _chatHubContext = chatHubContext;
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _loggedUserService = loggedUserService;
        }

        [Authorize]
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Content))
                return BadRequest(new { Message = "A mensagem não pode estar vazia." });

            var currentUserId = await _loggedUserService.UserLogged();

            if (string.IsNullOrEmpty(currentUserId.Id))
                return Unauthorized(new { Message = "Usuário não autenticado." });

            // Verificar se os usuários existem
            var currentUser = await _userRepository.GetById(currentUserId.Id);
            var receiverUser = await _userRepository.GetById(request.ReceiverId);

            if (currentUser == null || receiverUser == null)
                return BadRequest(new { Message = "Usuário não encontrado." });

            // Verificar se a conversa já existe
            var conversation = await _conversationRepository.GetConversationByUsers(currentUserId.Id, request.ReceiverId);

            // Se não existir, criar nova conversa
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    Id = Guid.NewGuid(),
                    UserId1 = currentUserId.Id,
                    UserId2 = request.ReceiverId,
                    CreatedAt = DateTime.UtcNow
                };

                await _conversationRepository.AddConversation(conversation);
                await _unitOfWork.Commit();
            }

            // Criar nova mensagem
            var newMessage = new Message
            {
                Id = Guid.NewGuid(),
                ConversationId = conversation.Id,
                SenderId = currentUserId.Id,
                Content = request.Content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            try
            {
                await _messageRepository.AddMessage(newMessage);
                await _unitOfWork.Commit();

                var response = new MessageResponse
                {
                    Id = newMessage.Id,
                    ConversationId = newMessage.ConversationId,
                    SenderId = newMessage.SenderId,
                    SenderName = currentUser.Name,
                    Content = newMessage.Content,
                    SentAt = newMessage.SentAt,
                    IsRead = newMessage.IsRead
                };

                // Enviar notificação via SignalR
                await _chatHubContext.Clients.Group(conversation.Id.ToString())
                    .SendAsync("ReceiveMessage", response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao enviar mensagem.", Error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("conversation/{conversationId}/history")]
        public async Task<IActionResult> GetConversationHistory(Guid conversationId)
        {
            try
            {
                var currentUserId = await _loggedUserService.UserLogged();

                // Verificar se a conversa existe
                var conversation = await _conversationRepository.GetConversationByConversationId(conversationId);

                if (conversation == null)
                    return NotFound(new { Message = "Conversa não encontrada." });

                // Verificar se o usuário faz parte da conversa
                if (conversation.UserId1 != currentUserId.Id && conversation.UserId2 != currentUserId.Id)
                    return Forbid();

                // Buscar mensagens
                var messages = await _messageRepository.GetMessagesByConversationId(conversationId);

                var messageResponses = messages.Select(m => new MessageResponse
                {
                    Id = m.Id,
                    ConversationId = m.ConversationId,
                    SenderId = m.SenderId,
                    SenderName = m.Sender?.Name ?? "Usuário",
                    Content = m.Content,
                    SentAt = m.SentAt,
                    IsRead = m.IsRead,
                    ReadAt = m.ReadAt
                }).ToList();

                return Ok(messageResponses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao carregar histórico.", Error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("conversation/{conversationId}/mark-as-read")]
        public async Task<IActionResult> MarkMessagesAsRead(Guid conversationId)
        {
            try
            {
                var currentUserId = await _loggedUserService.UserLogged();

                // Verificar se a conversa existe
                var conversation = await _conversationRepository.GetConversationByConversationId(conversationId);

                if (conversation == null)
                    return NotFound(new { Message = "Conversa não encontrada." });

                // Verificar se o usuário faz parte da conversa
                if (conversation.UserId1 != currentUserId.Id && conversation.UserId2 != currentUserId.Id)
                    return Forbid();

                // Marcar mensagens como lidas
                await _messageRepository.MarkMessagesAsReadByConversation(conversationId, currentUserId.Id);
                await _unitOfWork.Commit();

                // Notificar via SignalR
                await _chatHubContext.Clients.Group(conversationId.ToString())
                    .SendAsync("MessagesMarkedAsRead", new
                    {
                        ConversationId = conversationId,
                        ReadByUserId = currentUserId,
                        ReadAt = DateTime.UtcNow
                    });

                return Ok(new { Message = "Mensagens marcadas como lidas." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao marcar mensagens como lidas.", Error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadMessagesCount()
        {
            try
            {
                var currentUserId = await _loggedUserService.UserLogged();
                var unreadCount = await _messageRepository.GetTotalUnreadMessagesCount(currentUserId.Id);

                return Ok(new { UnreadCount = unreadCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao buscar mensagens não lidas.", Error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("conversations")]
        public async Task<IActionResult> GetUserConversations()
        {
            try
            {
                var currentUserId = await _loggedUserService.UserLogged();

                var conversations = await _conversationRepository.GetConversationsUser(currentUserId.Id);

                if (conversations == null || !conversations.Any())
                    return Ok(new List<ConversationResponse>());

                var conversationResponses = new List<ConversationResponse>();

                foreach (var conversation in conversations)
                {
                    // Identificar o outro usuário
                    var otherUserId = conversation.UserId1 == currentUserId.Id
                        ? conversation.UserId2
                        : conversation.UserId1;

                    var otherUser = await _userRepository.GetById(otherUserId);

                    // Buscar última mensagem
                    var lastMessage = await _messageRepository.GetLastMessageByConversationId(conversation.Id);

                    // Contar mensagens não lidas
                    var unreadCount = await _messageRepository.GetUnreadMessagesCount(conversation.Id, currentUserId.Id);

                    conversationResponses.Add(new ConversationResponse
                    {
                        ConversationId = conversation.Id,
                        OtherUserId = otherUserId,
                        OtherUserName = otherUser?.Name ?? "Usuário não encontrado",
                        LastMessage = lastMessage?.Content ?? "",
                        LastMessageDate = lastMessage?.SentAt ?? conversation.CreatedAt,
                        UnreadMessagesCount = unreadCount,
                        IsLastMessageFromMe = lastMessage?.SenderId == currentUserId.Id
                    });
                }

                // Ordenar por data da última mensagem
                conversationResponses = conversationResponses
                    .OrderByDescending(c => c.LastMessageDate)
                    .ToList();

                return Ok(conversationResponses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Erro ao carregar conversas.", Error = ex.Message });
            }
        }
    }

    #region DTOs

    public class SendMessageRequest
    {
        public string ReceiverId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class MessageResponse
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    public class ConversationResponse
    {
        public Guid ConversationId { get; set; }
        public string OtherUserId { get; set; } = string.Empty;
        public string OtherUserName { get; set; } = string.Empty;
        public string? OtherUserProfilePicture { get; set; }
        public string LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageDate { get; set; }
        public int UnreadMessagesCount { get; set; }
        public bool IsLastMessageFromMe { get; set; }
    }

    #endregion
}