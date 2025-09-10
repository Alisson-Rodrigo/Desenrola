using Desenrola.Application.Features.Auth.Commands.LoginCommand;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Desenrola.WebApi.Controllers;

[Route("api/auth")]
[OpenApiTags("Auth")]
public class AuthController(IMediator mediator) : Controller {
    private readonly IMediator _mediator = mediator;

    ///[TODO] - CREATE LOGIN HANDLER HERE 
    ///
    [HttpPost]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LoginUser(LoginCommand request)
    {
        LoginResponse response = await _mediator.Send(request);
        return Ok(response);
    }
}
