using Microsoft.AspNetCore.Identity;

namespace Desenrola.Domain.Entities;

public class User : IdentityUser
{
    public string Name { get; set; } = string.Empty;

    // 1:1 (um usuário pode ter um provider, ou não)
    public virtual Provider? Provider { get; set; }

    public bool IsActive { get; set; } = true;
    public string? ImageProfile { get; set; } = string.Empty;

    public ICollection<Conversation>? Conversation { get; set; }
    public virtual List<Evaluation> Evaluations { get; set; } = new();
    public virtual ICollection<Payment>? Payments { get; set; }
    public Payment? ActivePayment => Payments?
        .Where(p => p.Status == PaymentStatus.Completed &&
                   p.ExpirationDate > DateTime.UtcNow)
        .OrderByDescending(p => p.ExpirationDate)
        .FirstOrDefault();

    public User() : base() { }
}
