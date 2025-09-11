using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.User.Queries.GetByIdQueries
{
    public class GetByIdHandlerQueries : IRequestHandler<GetByIdQueries, GetByIdResultQueries>
    {
        private readonly ILogged _logged;
        private readonly IUserRepository _userRepository;

        public GetByIdHandlerQueries(ILogged logged, IUserRepository userRepository)
        {
            _logged = logged;
            _userRepository = userRepository;
        }

        public async Task<GetByIdResultQueries> Handle(GetByIdQueries request, CancellationToken cancellationToken)
        {
            var userLogged = await _logged.UserLogged();

            if (userLogged == null)
            {
                throw new BadRequestException("Usuário não autenticado.");
            }

            var user = await _userRepository.GetById(request.Id);

            if (user == null)
            {
                throw new BadRequestException($"Usuário com ID {request.Id} não encontrado.");
            }

            return new GetByIdResultQueries
            {
                Id = user.Id,
                Name = user.Name,
                UserName = user.UserName!,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber!
            };

        }
    }
}
