using FluentValidation;

namespace RO.DevTest.Application.Features.User.Commands.CreateUserCommand;
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>{
    public CreateUserCommandValidator() {
        RuleFor(cpau => cpau.Email)
            .NotNull()
            .NotEmpty()
            .WithMessage("O campo e-mail precisa ser preenchido");

        RuleFor(cpau => cpau.Email)
            .EmailAddress()
            .WithMessage("O campo e-mail precisa ser um e-mail válido");

        RuleFor(cpau => cpau.Password)
            .MinimumLength(6)
            .WithMessage("O campo senha precisa ter, pelo menos, 6 caracteres");

        RuleFor(cpau => cpau.PasswordConfirmation)
            .Matches(cpau => cpau.Password)
            .WithMessage("O campo de confirmação de senha deve ser igual ao campo senha");
    }
}
