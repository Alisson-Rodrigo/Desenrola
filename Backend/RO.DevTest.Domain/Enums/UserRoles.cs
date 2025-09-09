using System.ComponentModel;

namespace RO.DevTest.Domain.Enums;
public enum UserRoles {
    [Description("Admin")]
    Admin = 0,
    [Description("Customer")]
    Customer = 1,
}
