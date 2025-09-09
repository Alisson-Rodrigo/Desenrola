using MediatR;

namespace RO.DevTest.Application.Features.Auth.Commands.LoginCommand;

public class LoginCommand : IRequest<LoginResponse> {
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
