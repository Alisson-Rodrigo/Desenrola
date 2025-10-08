using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Queries.GetUserFavoritesQuery
{
    public class GetUserFavoritesQuery : IRequest<GetUserFavoritesResponse>
    {
        // Não é necessário passar o userId porque ele será extraído do usuário logado
    }
}
