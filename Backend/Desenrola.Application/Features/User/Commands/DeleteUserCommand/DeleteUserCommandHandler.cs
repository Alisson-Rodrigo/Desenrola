using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.User.Commands.DeleteUserCommand
{
    public class DeleteUserCommandHandler(IIdentityAbstractor identityAbstractor, ILogged logged) : IRequestHandler<DeleteUserCommand, Unit>
    {
        private readonly IIdentityAbstractor _identityAbstractor = identityAbstractor;
        private readonly ILogged _logged;

        public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não encontrado");

            var result = await _identityAbstractor.DeleteUser(user);

            if (!result.Succeeded)
                throw new BadRequestException(result);

            return Unit.Value;
        }
    }
}
