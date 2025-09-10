using Desenrola.Application.Features.Providers.Commands.CreateProvider;
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

        [HttpPost]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProvider(CreateProviderCommand request)
        {
            Guid response = await _mediator.Send(request);
            return Created(HttpContext.Request.GetDisplayUrl(), response);
        }

    }
}
