using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand
{
    /// <summary>
    /// Comando para iniciar o pagamento de um plano (VIP ou Master).
    /// </summary>
    public class PlanPaymentCommand : IRequest<ResponseStripeDTO>
    {
        public int PlanId { get; set; }
    }
}
