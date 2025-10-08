using Desenrola.Domain.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Domain.Entities
{
    public class Favorite : BaseEntity
    {
        public string UserId { get; set; }
        public User? User { get; set; }

        public Guid ProviderId { get; set; }
        public Provider Provider { get; set; }
    }
}
