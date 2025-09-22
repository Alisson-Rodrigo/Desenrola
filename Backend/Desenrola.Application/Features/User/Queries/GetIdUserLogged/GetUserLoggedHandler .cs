using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Infrastructure;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;

namespace Desenrola.Application.Features.User.Queries.GetIdUserLogged
{
    /// <summary>
    /// Manipulador responsável por recuperar as informações do usuário atualmente autenticado.
    /// </summary>
    /// <remarks>
    /// Esse handler utiliza o serviço <see cref="ILogged"/> para obter o usuário logado a partir
    /// do contexto HTTP e retorna suas informações básicas encapsuladas em um 
    /// <see cref="GetUserLoggedResult"/>.
    /// </remarks>
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
                Email = user.Email ?? string.Empty            };
        }
    }
}
