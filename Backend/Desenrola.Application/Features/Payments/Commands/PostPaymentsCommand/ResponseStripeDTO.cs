using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand
{
    public class ResponseStripeDTO
    {
        public string SessionId { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = string.Empty;
        public string PaymentIntentId { get; set; } = string.Empty;
        public DateTime? ExpirationDate { get; set; }
    }
}
