using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.CreateScheduleCommand
{
    public class CreateScheduleCommandValidator : AbstractValidator<CreateScheduleCommand>
    {
        public CreateScheduleCommandValidator()
        {
            RuleFor(x => x.DayOfWeek)
                .InclusiveBetween(0, 6).WithMessage("O dia da semana deve estar entre 0 e 6.");

            RuleFor(x => x.EndTime)
                .GreaterThan(x => x.StartTime).WithMessage("O horário final deve ser maior que o inicial.");
        }
    }
}
