using Desenrola.Application.Features.Favorite.Commands.CreateFavoriteCommand;
using Desenrola.Application.Features.Favorite.Commands.RemoveFavoriteCommand;
using Desenrola.Application.Features.Favorite.Queries.GetUserFavoritesQuery;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Desenrola.WebApi.Controllers
{
    /// <summary>
    /// Controlador responsável por gerenciar as operações relacionadas aos favoritos dos usuários.
    /// Permite adicionar, remover e listar provedores favoritados.
    /// </summary>
    [Route("api/favorites")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IMediator _mediator;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="FavoriteController"/>.
        /// </summary>
        /// <param name="mediator">Instância do mediator responsável por enviar os comandos e queries.</param>
        public FavoriteController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Cria um novo favorito para o usuário autenticado.
        /// </summary>
        /// <param name="request">Comando contendo o identificador do provedor a ser favoritado.</param>
        /// <returns>
        /// Retorna <see cref="StatusCodes.Status201Created"/> se o favorito for criado com sucesso,
        /// ou <see cref="StatusCodes.Status400BadRequest"/> se os dados forem inválidos.
        /// </returns>
        /// <remarks>
        /// Requer autenticação e o papel (Role) de <b>Customer</b>, <b>Provider</b> ou <b>Admin</b>.
        /// </remarks>
        [Authorize(Roles = "Customer, Admin, Provider")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateFavorite([FromBody] CreateFavoriteCommand request)
        {
            await _mediator.Send(request);
            return CreatedAtAction(nameof(CreateFavorite), new { providerId = request.ProviderId }, null);
        }

        /// <summary>
        /// Remove um provedor da lista de favoritos do usuário autenticado.
        /// </summary>
        /// <param name="request">Comando contendo o identificador do provedor a ser removido.</param>
        /// <returns>
        /// Retorna <see cref="StatusCodes.Status204NoContent"/> se o favorito for removido com sucesso,
        /// <see cref="StatusCodes.Status400BadRequest"/> se houver erro na requisição,
        /// ou <see cref="StatusCodes.Status404NotFound"/> se o favorito não for encontrado.
        /// </returns>
        /// <remarks>
        /// Requer autenticação e o papel (Role) de <b>Customer</b>, <b>Provider</b> ou <b>Admin</b>.
        /// </remarks>
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

        /// <summary>
        /// Retorna todos os provedores favoritados pelo usuário autenticado.
        /// </summary>
        /// <returns>
        /// Retorna uma lista de provedores favoritados com <see cref="StatusCodes.Status200OK"/>.
        /// </returns>
        /// <remarks>
        /// Requer autenticação e o papel (Role) de <b>Customer</b>, <b>Provider</b> ou <b>Admin</b>.
        /// </remarks>
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
