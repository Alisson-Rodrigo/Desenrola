using Desenrola.Application.Features.Favorite.Commands.CreateFavoriteCommand;

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Desenrola.WebApi.Controllers
{
    [Route("api/favorites")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FavoriteController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Criar um favorito
        [Authorize(Roles = "Customer, Admin, Provider")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateFavorite([FromBody] CreateFavoriteCommand request)
        {
            await _mediator.Send(request);
            return CreatedAtAction(nameof(CreateFavorite), new { providerId = request.ProviderId }, null);
        }

    }
}
