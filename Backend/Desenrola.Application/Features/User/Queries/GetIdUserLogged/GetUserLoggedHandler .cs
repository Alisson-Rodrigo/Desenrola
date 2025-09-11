using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.User.Queries.GetIdUserLogged
{
    public class GetUserLoggedHandler : IRequestHandler<GetIdUserLoggedQuery, GetUserLoggedResult>
    {
        private readonly ILogged _logged;

        public GetUserLoggedHandler(ILogged logged)
        {
            _logged = logged;
        }

        public async Task<GetUserLoggedResult> Handle(GetIdUserLoggedQuery request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não autenticado");

            return new GetUserLoggedResult
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
            };
        }
    }
}
