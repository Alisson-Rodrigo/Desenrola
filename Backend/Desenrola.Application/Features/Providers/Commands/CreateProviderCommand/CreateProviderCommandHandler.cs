using Desenrola.Application.Contracts.Application;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using Microsoft.AspNetCore.Hosting;
using Desenrola.Application.Contracts.Persistance.Repositories; // precisa importar

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    /// <summary>
    /// Handler respons�vel por processar o comando <see cref="CreateProviderCommand"/> 
    /// e realizar o cadastro de um novo prestador de servi�os.
    /// </summary>
    public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, Guid>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly ILogged _logged;
        private readonly ICPF _cpfValidator;
        private readonly IWebHostEnvironment _env;

        // URL p�blica base (ajuste porta se necess�rio)
        private readonly string _publicBaseUrl = "http://localhost:5087/imagens/providers/documents/";

        /// <summary>
        /// Construtor que inicializa as depend�ncias necess�rias.
        /// </summary>
        /// <param name="providerRepository">Reposit�rio para persist�ncia de prestadores.</param>
        /// <param name="logged">Servi�o para recuperar o usu�rio logado.</param>
        /// <param name="cpfValidator">Servi�o para valida��o de CPF.</param>
        /// <param name="env">Ambiente web para manipula��o de diret�rios e arquivos.</param>

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

        /// <summary>
        /// Manipula o comando de cria��o de prestador de servi�os.
        /// </summary>
        /// <param name="request">Comando contendo os dados do prestador a ser criado.</param>
        /// <param name="cancellationToken">Token de cancelamento ass�ncrono.</param>
        /// <returns>Retorna o <see cref="Guid"/> do prestador criado.</returns>
        /// <exception cref="BadRequestException">
        /// Lan�ada quando o usu�rio n�o � encontrado, j� possui cadastro como prestador
        /// ou os dados fornecidos n�o s�o v�lidos.
        /// </exception>
        public async Task<Guid> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
        {
            var user = await _logged.UserLogged();

            if (user == null)
                throw new BadRequestException("Usu�rio n�o encontrado.");

            var existingProvider = await _providerRepository.GetByUserIdAsync(user.Id);
            if (existingProvider != null)
                throw new BadRequestException("O usu�rio j� possui um cadastro como prestador.");

            var validator = new CreateProviderCommandValidator(_cpfValidator);
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var uploadPath = Path.Combine(_env.WebRootPath, "imagens", "providers", "documents");
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

                    // URL acess�vel externamente
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
                Categories = request.Categories,
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
