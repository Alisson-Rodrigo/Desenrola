using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;


namespace Desenrola.Application.Features.ServicesProviders.Commands.CreateServiceProviderCommand
{

    /// <summary>
    /// Handler responsável por processar o comando <see cref="CreateProviderServiceCommand"/>, 
    /// permitindo que prestadores de serviço logados e devidamente verificados publiquem 
    /// novos serviços na plataforma. Realiza validações de usuário, prestador e comando, 
    /// além de tratar o upload das imagens (convertendo-as para formato WebP) 
    /// e salvar as informações no repositório de serviços do prestador. 
    /// Retorna o <see cref="Guid"/> do serviço criado.
    /// </summary>

    public class CreateProviderServiceCommandHandler : IRequestHandler<CreateProviderServiceCommand, Guid>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly IProviderServiceRepository _providerServiceRepository;
        private readonly ILogged _logged;
        private readonly IWebHostEnvironment _env;

        private readonly string _publicBaseUrl = "https://desenrola.shop/imagens/providers/services";

        public CreateProviderServiceCommandHandler(
            IProviderRepository providerRepository,
            IProviderServiceRepository providerServiceRepository,
            ILogged logged,
            IWebHostEnvironment env)
        {
            _providerRepository = providerRepository;
            _providerServiceRepository = providerServiceRepository;
            _logged = logged;
            _env = env;
        }

        public async Task<Guid> Handle(CreateProviderServiceCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            // Busca o prestador vinculado ao usuário logado
            var provider = await _providerRepository.GetByUserIdAsync(user.Id);

            if (provider == null)
                throw new BadRequestException("Prestador não encontrado para este usuário.");

            // 🔎 Nova regra: só pode publicar serviço se a conta estiver ativa e verificada
            if (!provider.IsActive)
                throw new BadRequestException("Sua conta está inativa. Ative-a para publicar serviços.");

            if (!provider.IsVerified)
                throw new BadRequestException("Sua conta ainda não foi verificada. Aguarde a aprovação para publicar serviços.");

            // Validação do comando
            var validator = new CreateProviderServiceCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            // Pasta de upload
            var uploadPath = Path.Combine(_env.WebRootPath, "imagens","providers", "services");
            Directory.CreateDirectory(uploadPath);

            var imagensUrls = new List<string>();

            if (request.Images != null && request.Images.Count > 0)
            {
                foreach (var imagem in request.Images)
                {
                    var nameFileNotExtension = Path.GetFileNameWithoutExtension(imagem.FileName);
                    var nameFile = $"{Guid.NewGuid()}_{nameFileNotExtension}.webp";
                    var caminhoWebP = Path.Combine(uploadPath, nameFile);

                    using (var inputStream = imagem.OpenReadStream())
                    using (var image = await SixLabors.ImageSharp.Image.LoadAsync(inputStream, cancellationToken))
                    {
                        var encoder = new WebpEncoder { Quality = 90 };
                        await image.SaveAsync(caminhoWebP, encoder, cancellationToken);
                    }


                    var url = $"{_publicBaseUrl}/{nameFile}";
                    imagensUrls.Add(url);
                }
            }

            var service = new ProviderService
            {
                ProviderId = provider.Id,
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                ImageUrls = imagensUrls,
                IsActive = true,
                IsAvailable = true,
                CreatedOn = DateTime.UtcNow
            };

            await _providerServiceRepository.CreateAsync(service);
            return service.Id;
        }
    }
}
