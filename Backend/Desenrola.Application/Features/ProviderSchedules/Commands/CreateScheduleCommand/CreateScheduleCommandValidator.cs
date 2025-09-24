using Desenrola.Domain.Enums;
using FluentValidation;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.CreateScheduleCommand
{
    public class CreateScheduleCommandValidator : AbstractValidator<CreateScheduleCommand>
    {
        public CreateScheduleCommandValidator()
        {
            RuleFor(x => x.DayOfWeek)
                .IsInEnum()
                .WithMessage("O dia da semana informado não é válido.");

            RuleFor(x => x.StartTime)
                .NotEmpty().WithMessage("O horário inicial é obrigatório.")
                .Must(BeValidTime).WithMessage("O horário inicial deve estar no formato HH:mm:ss.");

            RuleFor(x => x.EndTime)
                .NotEmpty().WithMessage("O horário final é obrigatório.")
                .Must(BeValidTime).WithMessage("O horário final deve estar no formato HH:mm:ss.")
                .Must((cmd, end) => CompareTimes(cmd.StartTime, end))
                .WithMessage("O horário final deve ser maior que o inicial.");
        }

        private bool BeValidTime(string time)
        {
            return TimeSpan.TryParse(time, out _);
        }

        private bool CompareTimes(string start, string end)
        {
            if (TimeSpan.TryParse(start, out var startTime) &&
                TimeSpan.TryParse(end, out var endTime))
            {
                return endTime > startTime;
            }
            return false;
        }
    }
}
