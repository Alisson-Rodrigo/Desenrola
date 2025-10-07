using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Persistance.Repositories
{
    public interface IPaymentRepository : IBaseRepository<Payment>
    {
        Task<Payment?> GetActivePlanAsync(string userId);
        Task<Payment?> GetBySessionIdAsync(string sessionId);
        Task<Payment?> GetByPaymentIntentIdAsync(string paymentIntentId);
        Task<bool> HasActivePlanAsync(string userId, PlanTypeEnum planType);
        Task<List<Payment>> GetAllPlansByUserAsync(string userId);

        Task<Payment?> GetPendingPlan(string userId); // 🆕 novo método

        Task<List<Payment>> GetExpiredPaymentsAsync();
        void RemovePayment(Payment payment);
    }
}
