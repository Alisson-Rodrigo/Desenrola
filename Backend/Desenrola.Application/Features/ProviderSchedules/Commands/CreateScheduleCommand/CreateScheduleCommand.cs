using Desenrola.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.CreateScheduleCommand
{
    public class CreateScheduleCommand : IRequest<Unit>
    {
        public Guid ProviderId { get; set; }
        public WeekDay DayOfWeek { get; set; }   // agora é enum
        public string StartTime { get; set; } = string.Empty; // mudar para string
        public string EndTime { get; set; } = string.Empty;   // mudar para string
    }
}
