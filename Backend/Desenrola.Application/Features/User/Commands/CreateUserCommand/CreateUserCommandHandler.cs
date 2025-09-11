using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Domain.Exception;

namespace Desenrola.Application.Features.User.Commands.CreateUserCommand;

/// <summary>
/// Manipulador responsável pela criação de novos usuários.
/// </summary>
/// <remarks>
/// Esse handler valida os dados recebidos, verifica se o email já está em uso,
/// cria o usuário no Identity, atribui uma role e retorna o resultado da criação.
/// </remarks>
public class CreateUserCommandHandler(IIdentityAbstractor identityAbstractor) : IRequestHandler<CreateUserCommand, CreateUserResult> {
    private readonly IIdentityAbstractor _identityAbstractor = identityAbstractor;

    public async Task<CreateUserResult> Handle(CreateUserCommand request, CancellationToken cancellationToken) {
        CreateUserCommandValidator validator = new();
        ValidationResult validationResult = await validator.ValidateAsync(request, cancellationToken);

        if(!validationResult.IsValid) {
            throw new BadRequestException(validationResult);
        }

        // Check if the user already exists
        Domain.Entities.User? existingUser = await _identityAbstractor.FindUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new BadRequestException($"Email: {request.Email} em uso.");
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
