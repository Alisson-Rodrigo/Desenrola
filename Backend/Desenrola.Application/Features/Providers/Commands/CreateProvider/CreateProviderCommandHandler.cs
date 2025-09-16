using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistence.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using Microsoft.AspNetCore.Hosting; // precisa importar

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, Guid>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;
        private readonly ICPF _cpfValidator;
        private readonly IWebHostEnvironment _env;

        // URL pública base (ajuste porta se necessário)
        private readonly string _publicBaseUrl = "https://localhost:7014/imagens/providers";

        public CreateProviderCommandHandler(
            IProviderRepository providerRepository,
            ILogged logged,
            ICPF cpfValidator,
            IWebHostEnvironment env)
        {
            _providerRepository = providerRepository;
            _logged = logged;
            _cpfValidator = cpfValidator;
            _env = env;
        }

        public async Task<Guid> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usuário não encontrado.");

            var validator = new CreateProviderCommandValidator(_cpfValidator);
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            // Caminho físico dinâmico dentro de wwwroot
            var uploadPath = Path.Combine(_env.WebRootPath, "imagens", "providers");
            Directory.CreateDirectory(uploadPath);

            var imagensUrls = new List<string>();

            if (request.DocumentPhotos != null && request.DocumentPhotos.Count > 0)
            {
                foreach (var imagem in request.DocumentPhotos)
                {
                    var nameFileNotExtension = Path.GetFileNameWithoutExtension(imagem.FileName);
                    var nameFile = $"{Guid.NewGuid()}_{nameFileNotExtension}.webp";
                    var caminhoWebP = Path.Combine(uploadPath, nameFile);

                    using (var inputStream = imagem.OpenReadStream())
                    using (var image = await Image.LoadAsync(inputStream, cancellationToken))
                    {
                        var encoder = new WebpEncoder { Quality = 90 };
                        await image.SaveAsync(caminhoWebP, encoder, cancellationToken);
                    }

                    // URL acessível externamente
                    var url = $"{_publicBaseUrl}/{nameFile}";
                    imagensUrls.Add(url);
                }
            }

            var provider = new Provider
            {
                UserId = user.Id,
                CPF = request.CPF,
                RG = request.RG,
                DocumentPhotoUrl = imagensUrls,
                Address = request.Address,
                ServiceName = request.ServiceName,
                Description = request.Description,
                PhoneNumber = request.PhoneNumber,
                IsActive = true,
                IsVerified = false
            };

            await _providerRepository.CreateAsync(provider);
            return provider.Id;
        }
    }
}
