using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Queries.GetProviderProfileQueries
{

    /// <summary>
    /// Handler responsável por processar o comando <see cref="GetProviderProfileQuery"/>, 
    /// recuperando o perfil do prestador associado ao usuário logado. 
    /// Retorna um <see cref="GetProviderProfileResponse"/> com os dados completos do prestador, 
    /// ou lança exceção caso o usuário não possua cadastro como prestador.
    /// </summary>

    public class GetProviderProfileQueryHandler : IRequestHandler<GetProviderProfileQuery, GetProviderProfileResponse>
    {
        private readonly ILogged _logged;
        private readonly IProviderRepository _providerRepository;

        public GetProviderProfileQueryHandler(ILogged logged, IProviderRepository providerRepository)
        {
            _logged = logged;
            _providerRepository = providerRepository;
        }

        public async Task<GetProviderProfileResponse> Handle(GetProviderProfileQuery request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            var provider = await _providerRepository.GetByUserIdAsync(user.Id);

            if (provider == null)
                throw new BadRequestException("Usuário não possui perfil de prestador.");

            return new GetProviderProfileResponse
            {
                Id = provider.Id.ToString(),
                Email = provider.User.Email ?? "Não tem email",
                CPF = provider.CPF,
                ServiceName = provider.ServiceName,
                Description = provider.Description,
                Address = provider.Address,
                RG = provider.RG,
                PhoneNumber = provider.PhoneNumber,
                IsVerified = provider.IsVerified,
                DocumentPhotoUrl = provider.DocumentPhotoUrl ?? new List<string>(),
                Categories = provider.Categories,
            };
        }
    }
}
