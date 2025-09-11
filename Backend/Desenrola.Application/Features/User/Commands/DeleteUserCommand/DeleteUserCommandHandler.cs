using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.User.Commands.DeleteUserCommand
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Unit>
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogged _logged;

        public DeleteUserCommandHandler(IUserRepository userRepository, ILogged logged)
        {
            _userRepository = userRepository;
            _logged = logged;
        }

        public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não autenticado");

            await _userRepository.Delete(user);

            return Unit.Value;
        }
    }
}
