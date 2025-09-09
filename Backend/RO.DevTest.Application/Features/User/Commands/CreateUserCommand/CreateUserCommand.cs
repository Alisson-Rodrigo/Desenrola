using MediatR;
using RO.DevTest.Domain.Enums;

namespace RO.DevTest.Application.Features.User.Commands.CreateUserCommand;

public class CreateUserCommand : IRequest<CreateUserResult> {
    public string UserName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PasswordConfirmation { get; set; } = string.Empty;
    public UserRoles Role { get; set; }

    public Domain.Entities.User AssignTo() {
        return new Domain.Entities.User {
            UserName = UserName,
            Email = Email,
            Name = Name,
        };
    }
}
