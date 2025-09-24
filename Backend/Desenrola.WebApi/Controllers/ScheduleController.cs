using Desenrola.Application.Features.ProviderSchedules.Commands.CreateScheduleCommand;
using Desenrola.Application.Features.ProviderSchedules.Commands.UpdateScheduleCommand;
using Desenrola.Application.Features.ProviderSchedules.Queries.GetSchedulesByProviderQuery;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Desenrola.WebApi.Controllers
{
    [ApiController]
    [Route("api/schedule")]

    public class ScheduleController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ScheduleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize(Roles = "Provider")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateScheduleCommand command)
        {
            await _mediator.Send(command);
            return Ok(new { message = "Agenda criada com sucesso." });
        }

        [Authorize]
        [HttpGet("provider/{providerId:guid}")]
        public async Task<IActionResult> GetByProvider(Guid providerId)
        {
            var result = await _mediator.Send(new GetSchedulesByProviderQuery(providerId));
            return Ok(result);
        }

        [Authorize(Roles = "Provider")]
        [HttpPut]
        public async Task<IActionResult> Update([FromForm] UpdateScheduleCommand command)
        {
            await _mediator.Send(command);
            return Ok(new { message = "Agenda atualizada com sucesso." });
        }

    }
}
