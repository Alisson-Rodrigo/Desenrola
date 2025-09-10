using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Auth.Commands.ResetPasswordCommand
{
    public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordCommandValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Token não pode ser vazio.")
                .NotNull().WithMessage("Token não pode ser nulo.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Senha não pode ser vazia.")
                .NotNull().WithMessage("Senha não pode ser nula.")
                .MinimumLength(6).WithMessage("Senha deve ter no mínimo 6 caracteres.");
            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Confirmação de senha não pode ser vazia.")
                .NotNull().WithMessage("Confirmação de senha não pode ser nula.")
                .Equal(x => x.Password).WithMessage("Senha e confirmação não conferem.");

        }
    }
}
