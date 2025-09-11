using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.User.Commands.UpdateUserCommand
{

    /// <summary>
    /// Manipulador responsável pela atualização de dados de usuários.
    /// </summary>
    /// <remarks>
    /// Esse handler garante que o usuário esteja autenticado e só possa atualizar seus próprios dados.
    /// Ele busca o usuário atual no repositório, aplica as alterações recebidas no comando
    /// e persiste as modificações.
    /// </remarks>
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Unit>
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogged _logged;

        public UpdateUserCommandHandler(IUserRepository userRepository, ILogged logged)
        {
            _userRepository = userRepository;
            _logged = logged;
        }

        public async Task<Unit> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
        {
            var userLogged = await _logged.UserLogged();

            if (userLogged == null)
            {
                throw new BadRequestException("Usuário não autenticado");
            }

            if (userLogged.Id != command.Id)
            {
                throw new BadRequestException("Você não tem permissão para atualizar outro usuário.");
            }

            // Buscar o usuário atual
            var existingUser = await _userRepository.GetById(command.Id);
            if (existingUser == null)
            {
                throw new BadRequestException($"Usuário com Id {command.Id} não encontrado.");
            }

            // 🔑 Mapeamento do comando -> entidade
            existingUser.UserName = command.UserName;
            existingUser.Name = command.Name;
            existingUser.Email = command.Email;


            await _userRepository.UpdateAsync(existingUser);

            return Unit.Value;
        }
    }
}
