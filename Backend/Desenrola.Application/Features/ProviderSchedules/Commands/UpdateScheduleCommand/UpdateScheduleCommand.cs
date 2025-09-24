using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.UpdateScheduleCommand
{
    public class UpdateScheduleCommand : IRequest<Unit>
    {
        public Guid ScheduleId { get; set; }       // ID da agenda que será atualizada
        public Guid ProviderId { get; set; }       // Garantir que pertence ao prestador
        public int DayOfWeek { get; set; }         // Novo dia
        public TimeSpan StartTime { get; set; }    // Novo horário inicial
        public TimeSpan EndTime { get; set; }      // Novo horário final
        public bool IsAvailable { get; set; }      // Ativo ou não
    }
}
