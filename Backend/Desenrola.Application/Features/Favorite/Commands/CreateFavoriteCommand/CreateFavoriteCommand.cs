using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Commands.CreateFavoriteCommand
{
    public class CreateFavoriteCommand : IRequest<Unit>
    {
        public Guid ProviderId { get; set; }   // Prestador que será adicionado aos favoritos
    }
}
