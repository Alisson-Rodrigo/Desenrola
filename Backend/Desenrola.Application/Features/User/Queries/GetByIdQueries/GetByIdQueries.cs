using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.User.Queries.GetByIdQueries
{
    public class GetByIdQueries : IRequest<GetByIdResultQueries>
    {
        public string Id { get; set; } = string.Empty;
    }
}
