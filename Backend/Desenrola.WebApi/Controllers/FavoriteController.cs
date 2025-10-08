using Desenrola.Application.Features.Favorite.Commands.CreateFavoriteCommand;
using Desenrola.Application.Features.Favorite.Commands.RemoveFavoriteCommand;
using Desenrola.Application.Features.Favorite.Queries.GetUserFavoritesQuery;
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

        // Remover um favorito
        [Authorize(Roles = "Customer, Admin, Provider")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveFavorite([FromBody] RemoveFavoriteCommand request)
        {
            await _mediator.Send(request);
            return NoContent();
        }

        // Obter provedores favoritados pelo usuário
        [Authorize(Roles = "Customer, Admin, Provider")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserFavorites()
        {
            var result = await _mediator.Send(new GetUserFavoritesQuery());
            return Ok(result);
        }
    }
}
