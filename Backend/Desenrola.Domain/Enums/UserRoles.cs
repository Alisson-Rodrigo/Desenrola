using System.ComponentModel;

namespace Desenrola.Domain.Enums;
public enum UserRoles {
    [Description("Admin")]
    Admin = 0,
    [Description("Customer")]
    Customer = 1,
    [Description("Provider")]
    Provider = 2,
}
