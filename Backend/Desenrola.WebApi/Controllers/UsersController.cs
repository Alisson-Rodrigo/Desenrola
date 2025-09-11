using Desenrola.Application.Features.User.Commands.CreateUserCommand;
using Desenrola.Application.Features.User.Commands.DeleteUserCommand;
using Desenrola.Application.Features.User.Commands.UpdateUserCommand;
using Desenrola.Application.Features.User.Queries.GetByIdQueries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Desenrola.WebApi.Controllers;

[Route("api/user")]
[OpenApiTags("Users")]
public class UsersController(IMediator mediator) : Controller {
    private readonly IMediator _mediator = mediator;

    [HttpPost]
    [ProducesResponseType(typeof(CreateUserResult), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(CreateUserResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateUser(CreateUserCommand request) {
        CreateUserResult response = await _mediator.Send(request);
        return Created(HttpContext.Request.GetDisplayUrl(), response);
    }

    [Authorize(Roles = "Customer, Admin")]
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser([FromForm] UpdateUserCommand request)
    {
        await _mediator.Send(request);
        return NoContent();
    }

    [Authorize(Roles = "Customer, Admin")]
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteUser([FromForm] DeleteUserCommand command)
    {
        var response = new DeleteUserCommand { };
        await _mediator.Send(response);
        return NoContent();
    }

    [Authorize(Roles = "Customer, Admin")]
    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(typeof(GetByIdResultQueries), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] string id)
    {
        var query = new GetByIdQueries { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
            return NotFound();

        return Ok(result);
    }
}
