using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;
using RO.DevTest.Application.Contracts.Infrastructure;
using RO.DevTest.Domain.Exception;

namespace RO.DevTest.Application.Features.User.Commands.CreateUserCommand;

/// <summary>
/// Command handler for the creation of <see cref="Domain.Entities.User"/>
/// </summary>
public class CreateUserCommandHandler(IIdentityAbstractor identityAbstractor) : IRequestHandler<CreateUserCommand, CreateUserResult> {
    private readonly IIdentityAbstractor _identityAbstractor = identityAbstractor;

    public async Task<CreateUserResult> Handle(CreateUserCommand request, CancellationToken cancellationToken) {
        CreateUserCommandValidator validator = new();
        ValidationResult validationResult = await validator.ValidateAsync(request, cancellationToken);

        if(!validationResult.IsValid) {
            throw new BadRequestException(validationResult);
        }

        Domain.Entities.User newUser = request.AssignTo();
        IdentityResult userCreationResult = await _identityAbstractor.CreateUserAsync(newUser, request.Password);
        if(!userCreationResult.Succeeded) {
            throw new BadRequestException(userCreationResult);
        }

        IdentityResult userRoleResult = await _identityAbstractor.AddToRoleAsync(newUser, request.Role);
        if(!userRoleResult.Succeeded) {
            throw new BadRequestException(userRoleResult);
        }

        return new CreateUserResult(newUser);
    }
}
