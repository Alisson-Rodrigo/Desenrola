using Desenrola.Domain.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Domain.Entities
{
    public class Evaluation : BaseEntity
    {
        public User? User { get; set; }
        public string UserId { get; set; } = string.Empty;

        public Guid ProviderId { get; set; }

        public Provider? Provider { get; set; }

        public int Note { get; set; }
        public string? Comment { get; set; }

    }
}
