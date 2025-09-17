using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Commands.MarkProviderVerifyCcommad
{
    public class MarkProviderVerifyCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
