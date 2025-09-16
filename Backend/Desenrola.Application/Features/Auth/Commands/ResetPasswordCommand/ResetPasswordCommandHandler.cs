using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Auth.Commands.ResetPasswordCommand
{

    /// <summary>
    /// Manipulador responsável por processar o comando de redefinição de senha.
    /// </summary>
    /// <remarks>
    /// Esse handler valida o comando recebido, verifica a validade do token de recuperação, 
    /// identifica o usuário pelo email contido no token e reseta a senha utilizando o Identity.
    /// </remarks>
    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>
    {
        private readonly IIdentityAbstractor _identityAbstractor;

        private readonly ITokenService _tokenService;


        public ResetPasswordCommandHandler(
            IIdentityAbstractor identityAbstractor, ITokenService tokenService)
        {
            _identityAbstractor = identityAbstractor;

            _tokenService = tokenService;
        }

        public async Task<Unit> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
        {
            // Validação dos dados de entrada
            var validator = new ResetPasswordCommandValidator();

            var validationResult = await validator.ValidateAsync(command, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult);
            }

            // Valida o token de recuperação
            if (!_tokenService.ValidatePasswordResetToken(command.Token, out ClaimsPrincipal principal))
            {
                throw new BadRequestException("Token inválido ou expirado");
            }

            // Extrai o email do usuário do token
            var userEmail = principal.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrWhiteSpace(userEmail))
            {
                throw new BadRequestException("Token não contém um email válido");
            }

            // Busca o usuário pelo email
            var user = await _identityAbstractor.FindUserByEmailAsync(userEmail);
            if (user == null)
            {
                throw new BadRequestException("Usuário não encontrado");
            }

            var identityToken = await _tokenService.GetIdentityResetToken(userEmail);
            if (string.IsNullOrEmpty(identityToken))
            {
                throw new BadRequestException("Token inválido ou já utilizado.");
            }

            // Reseta a senha do usuário
            var result = await _identityAbstractor.ResetPasswordAsync(user, identityToken, command.Password);

            if (!result.Succeeded)
            {
                throw new BadRequestException(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            return Unit.Value;
        }
    }
}
