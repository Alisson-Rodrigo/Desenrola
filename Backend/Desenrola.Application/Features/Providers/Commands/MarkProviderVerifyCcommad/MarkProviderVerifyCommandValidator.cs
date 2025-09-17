using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Commands.MarkProviderVerifyCcommad
{
    public class MarkProviderVerifyCommandValidator : AbstractValidator<MarkProviderVerifyCommand>
    {
        public MarkProviderVerifyCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("O ID do prestador é obrigatório.");
        }
    }
}
