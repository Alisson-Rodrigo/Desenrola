using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Commands.DeleteProviderCommand
{
    public class DeleteProviderCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }

    }
}
