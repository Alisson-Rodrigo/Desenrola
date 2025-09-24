using Desenrola.Domain.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Domain.Entities
{
    public class ProviderSchedule : BaseEntity
    {
        public Guid ProviderId { get; set; }
        public virtual Provider Provider { get; set; } = null!;

        // Dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
        public int DayOfWeek { get; set; }

        // Horários disponíveis
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        // Status
        public bool IsAvailable { get; set; } = true;
    }
}
