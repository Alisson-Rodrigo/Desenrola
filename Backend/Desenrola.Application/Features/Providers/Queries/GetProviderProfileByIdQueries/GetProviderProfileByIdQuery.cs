using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Queries.GetProviderProfileByIdQueries
{
    public class GetProviderProfileByIdQuery : IRequest<ProviderProfileResult>
    {
        public Guid Id { get; set; }
    }
}
