using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories
{
    public class PaymentRepository : BaseRepository<Payment>, IPaymentRepository
    {
        private readonly DefaultContext _context;

        public PaymentRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna o plano ativo mais recente de um usuário (ainda não expirado e com pagamento concluído).
        /// </summary>
        public async Task<Payment?> GetActivePlanAsync(string userId)
        {
            return await _context.Payments
                .Where(p => p.UserId == userId &&
                            p.Status == PaymentStatus.Completed &&
                            p.ExpirationDate > DateTime.UtcNow)
                .OrderByDescending(p => p.PurchaseDate)
                .FirstOrDefaultAsync();
        }
        /// <summary>
        /// 🆕 Retorna o plano pendente de um usuário (aguardando pagamento).
        /// </summary>
        public async Task<Payment?> GetPendingPlan(string userId)
        {
            return await _context.Payments
                .AsNoTracking()
                .FirstOrDefaultAsync(p =>
                    p.UserId == userId &&
                    p.Status == PaymentStatus.Pending);
        }

        /// <summary>
        /// Retorna um pagamento a partir do SessionId (Stripe Session).
        /// </summary>
        public async Task<Payment?> GetBySessionIdAsync(string sessionId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.SessionId == sessionId);
        }

        /// <summary>
        /// Retorna um pagamento a partir do PaymentIntentId (Stripe PaymentIntent).
        /// </summary>
        public async Task<Payment?> GetByPaymentIntentIdAsync(string paymentIntentId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.PaymentIntentId == paymentIntentId);
        }

        /// <summary>
        /// Verifica se o usuário possui um plano ativo de um determinado tipo.
        /// </summary>
        public async Task<bool> HasActivePlanAsync(string userId, PlanTypeEnum planType)
        {
            return await _context.Payments
                .AnyAsync(p => p.UserId == userId &&
                               p.PlanType == planType &&
                               p.Status == PaymentStatus.Completed &&
                               p.ExpirationDate > DateTime.UtcNow);
        }

        /// <summary>
        /// Retorna todos os planos (histórico) de um usuário.
        /// </summary>
        public async Task<List<Payment>> GetAllPlansByUserAsync(string userId)
        {
            return await _context.Payments
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.PurchaseDate)
                .ToListAsync();
        }

        /// <summary>
        /// Retorna todos os pagamentos expirados.
        /// </summary>
        public async Task<List<Payment>> GetExpiredPaymentsAsync()
        {
            return await _context.Payments
                .Where(p => p.Status == PaymentStatus.Completed &&
                            p.ExpirationDate <= DateTime.UtcNow)
                .ToListAsync();
        }

        /// <summary>
        /// Remove um pagamento do contexto.
        /// </summary>
        public void RemovePayment(Payment payment)
        {
            _context.Payments.Remove(payment);
        }
    }
}
