using Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand;
using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Application
{
    public interface IStripeService
    {
        Task<ResponseStripeDTO> CreateOneTimePayment(User user, PlanTypeEnum planType);
    }
}
