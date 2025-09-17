using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Commands.UpdateServiceProviderCommand
{
    public class UpdateProviderServiceCommandValidator : AbstractValidator<UpdateProviderServiceCommand>
    {
        public UpdateProviderServiceCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("O título do serviço é obrigatório.")
                .MaximumLength(100).WithMessage("O título deve ter no máximo 100 caracteres.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .MaximumLength(500).WithMessage("A descrição deve ter no máximo 500 caracteres.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue)
                .WithMessage("O preço deve ser maior ou igual a zero.");

            RuleFor(x => x.Category)
                .IsInEnum().WithMessage("A categoria informada é inválida.");
        }
    }
}
