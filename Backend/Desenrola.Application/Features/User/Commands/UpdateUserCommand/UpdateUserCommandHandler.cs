using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.User.Commands.UpdateUserCommand
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Unit>
    {
        private readonly IUserRepository _userRepository;
        private readonly IIdentityAbstractor _identityAbstractor;
        private readonly ILogged _logged;

        public UpdateUserCommandHandler(IUserRepository userRepository, ILogged logged, IIdentityAbstractor identityAbstractor
            )
        {
            _userRepository = userRepository;
            _logged = logged;
            _identityAbstractor = identityAbstractor;
        }

        public async Task<Unit> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
        {
            var userLogged = await _logged.UserLogged();
            if (userLogged == null)
                throw new BadRequestException("Usuário não autenticado");

            var existingUser = await _userRepository.GetById(userLogged.Id);
            if (existingUser == null)
                throw new BadRequestException("Usuário não encontrado.");

            // Atualizar dados simples
            existingUser.Name = command.Name;

            // Atualizar username e email corretamente via Identity
            var usernameResult = await _identityAbstractor.SetUserNameAsync(existingUser, command.UserName);
            if (!usernameResult.Succeeded)
                throw new BadRequestException(string.Join(", ", usernameResult.Errors.Select(e => e.Description)));

            var emailResult = await _identityAbstractor.SetEmailAsync(existingUser, command.Email);
            if (!emailResult.Succeeded)
                throw new BadRequestException(string.Join(", ", emailResult.Errors.Select(e => e.Description)));

            // Como alteramos propriedades adicionais (Name), precisamos persistir o objeto atualizado
            var updateResult = await _identityAbstractor.UpdateUserAsync(existingUser);
            if (!updateResult.Succeeded)
                throw new BadRequestException(string.Join(", ", updateResult.Errors.Select(e => e.Description)));

            return Unit.Value;
        }

    }
}
