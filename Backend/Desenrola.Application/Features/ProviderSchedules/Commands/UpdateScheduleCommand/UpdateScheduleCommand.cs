using Desenrola.Domain.Enums;
using MediatR;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.UpdateScheduleCommand
{
    public class UpdateScheduleCommand : IRequest<Unit>
    {
        public Guid ScheduleId { get; set; }       // ID da agenda que será atualizada
        public Guid ProviderId { get; set; }       // Garantir que pertence ao prestador
        public WeekDay DayOfWeek { get; set; }     // Enum do dia da semana
        public string StartTime { get; set; } = string.Empty; // Recebe como string
        public string EndTime { get; set; } = string.Empty;   // Recebe como string
        public bool IsAvailable { get; set; }      // Ativo ou não
    }
}
