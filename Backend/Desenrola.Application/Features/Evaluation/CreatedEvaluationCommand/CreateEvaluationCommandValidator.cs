using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Evaluation.CreatedEvaluationCommand
{
    public class CreateEvaluationCommandValidator : AbstractValidator<CreatedEvaluationCommand>
    {
        public CreateEvaluationCommandValidator()
        {
            RuleFor(x => x.Note)
                .NotEmpty().WithMessage("A nota não pode ser vazia.")
                .InclusiveBetween(1, 5).WithMessage("A nota deve estar entre 1 e 5.");
        }
    }
}
