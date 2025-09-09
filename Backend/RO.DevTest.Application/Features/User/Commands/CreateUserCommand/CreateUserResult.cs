namespace RO.DevTest.Application.Features.User.Commands.CreateUserCommand;

public record CreateUserResult {
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public CreateUserResult () { }

    public CreateUserResult(Domain.Entities.User user) { 
        Id = user.Id;
        UserName = user.UserName!;
        Email = user.Email!;
        Name = user.Name!;
    }
}
