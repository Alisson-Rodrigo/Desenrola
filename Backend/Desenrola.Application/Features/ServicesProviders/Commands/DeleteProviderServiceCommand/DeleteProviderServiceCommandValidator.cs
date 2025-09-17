using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Commands.DeleteProviderServiceCommand
{
    public class DeleteProviderServiceCommandValidator : AbstractValidator<DeleteProviderServiceCommand>
    {
        public DeleteProviderServiceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("O ID do serviço é obrigatório.");
        }
    }
}
