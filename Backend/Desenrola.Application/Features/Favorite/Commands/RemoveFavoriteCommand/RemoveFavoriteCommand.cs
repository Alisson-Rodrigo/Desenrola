using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Commands.RemoveFavoriteCommand
{
    public class RemoveFavoriteCommand : IRequest<Unit>
    {
        public Guid ProviderId { get; set; }   // Provedor que será removido dos favoritos
    }
}
