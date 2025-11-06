using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.Providers.Commands.CreateProvider;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.Providers.Commands;

public class CreateProviderCommandHandlerTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<ILogged> _loggedMock = new();
    private readonly Mock<ICPF> _cpfValidatorMock = new();
    private readonly Mock<IWebHostEnvironment> _envMock = new();
    private readonly CreateProviderCommandHandler _sut;

    public CreateProviderCommandHandlerTests()
    {
        _envMock.Setup(x => x.WebRootPath).Returns(Path.GetTempPath()); // ✅ Adicionado aqui

        _sut = new CreateProviderCommandHandler(
            _providerRepositoryMock.Object,
            _loggedMock.Object,
            _cpfValidatorMock.Object,
            _envMock.Object
        );
    }


  

    // 🔹 Função auxiliar para criar um comando válido
    private static CreateProviderCommand CreateValidCommand()
    {
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns("doc.jpg");

        return new CreateProviderCommand(
            CPF: "12345678901",
            RG: "1234567",
            DocumentPhotos: new List<IFormFile> { fileMock.Object },
            Address: "Rua Teste, 123",
            ServiceName: "Serviço Teste",
            Description: "Descrição válida",
            PhoneNumber: "+5511999999999",
            Categories: new List<ServiceCategory> { ServiceCategory.Beleza } // use valor real do seu enum
        );
    }

    // ----------------------------------------------------
    // 1️⃣ Usuário não logado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given no logged user should throw BadRequestException")]
    public void Handle_WhenUserNotLogged_ShouldThrowBadRequestException()
    {
        // Arrange
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync((Domain.Entities.User?)null);

        var command = CreateValidCommand();

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Usuário não encontrado.");
    }

    // ----------------------------------------------------
    // 2️⃣ Usuário já é prestador
    // ----------------------------------------------------
    [Fact(DisplayName = "Given existing provider should throw BadRequestException")]
    public void Handle_WhenUserAlreadyProvider_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = new Domain.Entities.User { Id = Guid.NewGuid().ToString() };

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByUserIdAsync(user.Id))
            .ReturnsAsync(new Provider { Id = Guid.NewGuid(), UserId = user.Id, CPF = "123", RG = "123", Address = "x", DocumentPhotoUrl = new(), Categories = new(), ServiceName = "x", Description = "x", PhoneNumber = "x" });

        var command = CreateValidCommand();

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("O usuário já possui um cadastro como prestador.");
    }

    // ----------------------------------------------------
    // 3️⃣ CPF inválido
    // ----------------------------------------------------
    [Fact(DisplayName = "Given invalid CPF should throw BadRequestException")]
    public void Handle_WhenCPFIsInvalid_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = new Domain.Entities.User { Id = Guid.NewGuid().ToString() };

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByUserIdAsync(user.Id))
            .ReturnsAsync((Provider?)null);
        _cpfValidatorMock.Setup(x => x.IsValidCPF(It.IsAny<string>())).Returns(false);

        var command = CreateValidCommand();

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>();
    }

   
}
