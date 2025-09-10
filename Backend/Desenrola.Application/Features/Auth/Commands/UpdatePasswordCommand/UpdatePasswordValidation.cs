using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Auth.Commands.UpdatePasswordCommand
{
    public class UpdatePasswordValidation : AbstractValidator<UpdatePasswordCommand>
    {
        public UpdatePasswordValidation()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email é necessário.")
                .EmailAddress()
                .WithMessage("Email inválido.");
        }
    }
}
