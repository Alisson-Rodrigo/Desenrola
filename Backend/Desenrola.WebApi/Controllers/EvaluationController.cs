using Desenrola.Application.Features.Evaluation.Command.CreatedEvaluationCommand;
using Desenrola.Application.Features.Evaluation.Queries.GetEvaluationsByProviderQuery;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Desenrola.WebApi.Controllers
{
    [ApiController]
    [Route("api/evaluation")]
    [Authorize] // ✅ apenas usuários autenticados podem avaliar
    public class EvaluationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public EvaluationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Cria uma avaliação para um prestador.
        /// </summary>
        /// <param name="command">Dados da avaliação (ProviderId, Note, Comment)</param>
        /// <returns>Status 200 em caso de sucesso</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatedEvaluationCommand command)
        {
            await _mediator.Send(command);
            return Ok(new { message = "Avaliação criada com sucesso." });
        }

        [HttpGet("provider/{providerId:guid}")]
        public async Task<IActionResult> GetByProvider(Guid providerId)
        {
            var result = await _mediator.Send(new GetEvaluationsByProviderQuery(providerId));
            return Ok(result);
        }


        [HttpGet("provider/{providerId:guid}/average")]
        public async Task<IActionResult> GetAverage(Guid providerId)
        {
            var result = await _mediator.Send(new GetAverageEvaluationQuery(providerId));
            return Ok(new { average = result });
        }
    }
}
