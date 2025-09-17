using Desenrola.Application.Features.Providers.Commands.CreateProvider;
using Desenrola.Application.Features.Providers.Commands.DeleteProviderCommand;
using Desenrola.Application.Features.Providers.Commands.MarkProviderVerifyCcommad;
using Desenrola.Application.Features.Providers.Commands.UpdateProvider;
using Desenrola.Application.Features.Providers.Queries.MarkProviderQueries;
using Desenrola.Application.Features.ServicesProviders.Commands.UpdateServiceProviderCommand;
using Desenrola.Application.Features.User.Commands.CreateUserCommand;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Desenrola.WebApi.Controllers
{
    [Route("api/provider")]
    [ApiController]
    public class ProviderController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator _mediator = mediator;

        [Authorize]
        [HttpPost]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProvider([FromForm] CreateProviderCommand request)
        {
            Guid response = await _mediator.Send(request);
            return Ok(response);
        }

        [Authorize]
        [HttpPut]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProvider([FromForm] UpdateProviderCommand request)
        {
            Guid response = await _mediator.Send(request);
            return Ok(response);

        }

        [Authorize]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteProvider([FromForm] DeleteProviderCommand request)
        {
            await _mediator.Send(request);
            return NoContent();
        }

        [Authorize(Roles = "Admin")] // 👈 apenas admin pode verificar
        [HttpPost("mark-provider")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> VerifyProvider([FromForm] MarkProviderVerifyCommand request)
        {
            await _mediator.Send(request);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        [ProducesResponseType(typeof(PagedResultPendingProviders), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPendingProviders([FromQuery] PagedRequestPendingProviders request)
        {
            var result = await _mediator.Send(request);
            return Ok(result);
        }

    }
}
