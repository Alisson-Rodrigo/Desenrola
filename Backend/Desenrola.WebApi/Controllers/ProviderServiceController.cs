using Desenrola.Application.Features.ServicesProviders.Commands.CreateServiceProviderCommand;
using Desenrola.Application.Features.ServicesProviders.Commands.UpdateServiceProviderCommand;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Desenrola.WebApi.Controllers
{
    [Route("api/provider/services")]
    [ApiController]
    public class ProviderServiceController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProviderServiceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateService([FromForm] CreateProviderServiceCommand request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        // 🔹 Atualizar serviço
        [Authorize]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateService([FromForm] UpdateProviderServiceCommand request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteService([FromForm] UpdateProviderServiceCommand request)
        {
            await _mediator.Send(request);
            return NoContent();
        }

    }
}
