using Desenrola.Domain.Abstract;
using System;

namespace Desenrola.Domain.Entities
{
    public class Payment : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public PlanTypeEnum PlanType { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string? PaymentIntentId { get; set; }
        public string? StripeInvoiceUrl { get; set; }
        public decimal Amount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public PaymentStatus Status { get; set; }
        public virtual User User { get; set; } = null!;
    }

    public enum PlanTypeEnum
    {
        Normal = 1,
        VIP = 2,
        Master = 3
    }

    public enum PaymentStatus
    {
        Pending = 1,    // Pagamento iniciado mas não concluído
        Completed = 2,  // Pagamento confirmado
        Failed = 3,     // Pagamento falhou
        Refunded = 4,   // Pagamento reembolsado
        Expired = 5     // Sessão de pagamento expirou
    }
}
