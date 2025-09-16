using Microsoft.AspNetCore.Identity;

namespace Desenrola.Domain.Entities;

public class User : IdentityUser
{
    public string Name { get; set; } = string.Empty;

    // 1:1 (um usuário pode ter um provider, ou não)
    public virtual Provider? Provider { get; set; }

    public bool IsActive { get; set; } = true;

    public User() : base() { }
}
