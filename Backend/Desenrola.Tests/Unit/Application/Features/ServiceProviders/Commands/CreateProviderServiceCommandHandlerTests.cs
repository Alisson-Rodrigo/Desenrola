using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.ServicesProviders.Commands.CreateServiceProviderCommand;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.ServicesProviders.Commands;

public class CreateProviderServiceCommandHandlerTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<IProviderServiceRepository> _providerServiceRepositoryMock = new();
    private readonly Mock<ILogged> _loggedMock = new();
    private readonly Mock<IWebHostEnvironment> _envMock = new();
    private readonly CreateProviderServiceCommandHandler _sut;

    public CreateProviderServiceCommandHandlerTests()
    {
        _envMock.Setup(x => x.WebRootPath).Returns(Path.GetTempPath());

        _sut = new CreateProviderServiceCommandHandler(
            _providerRepositoryMock.Object,
            _providerServiceRepositoryMock.Object,
            _loggedMock.Object,
            _envMock.Object
        );
    }

    private static CreateProviderServiceCommand CreateValidCommand()
    {
        var fileMock = new Mock<IFormFile>();
        fileMock.Setup(f => f.FileName).Returns("foto.png");
        fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[] { 1, 2, 3 }));

        return new CreateProviderServiceCommand(
            Title: "Serviço de Jardinagem",
            Description: "Corte e manutenção de gramados.",
            Price: 100.0m,
            Category: ServiceCategory.Jardinagem, // ajuste conforme enum real
            Images: new List<IFormFile> { fileMock.Object }
        );
    }

    private static Domain.Entities.User CreateFakeUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "User Test",
        Email = "user@email.com",
        UserName = "user_test"
    };

    private static Provider CreateFakeProvider(Domain.Entities.User user, bool isActive = true, bool isVerified = true) => new()
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        CPF = "12345678901",
        RG = "1234567",
        Address = "Rua Teste",
        Categories = new List<ServiceCategory> { ServiceCategory.Jardinagem },
        ServiceName = "Serviço Teste",
        Description = "Descrição Teste",
        PhoneNumber = "+5511999999999",
        DocumentPhotoUrl = new(),
        IsActive = isActive,
        IsVerified = isVerified
    };

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
    // 2️⃣ Prestador não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given no provider for user should throw BadRequestException")]
    public void Handle_WhenProviderNotFound_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = CreateFakeUser();
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByUserIdAsync(user.Id)).ReturnsAsync((Provider?)null);

        var command = CreateValidCommand();

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Prestador não encontrado para este usuário.");
    }

    // ----------------------------------------------------
    // 3️⃣ Prestador inativo
    // ----------------------------------------------------
    [Fact(DisplayName = "Given inactive provider should throw BadRequestException")]
    public void Handle_WhenProviderInactive_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, isActive: false);
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByUserIdAsync(user.Id)).ReturnsAsync(provider);

        var command = CreateValidCommand();

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Sua conta está inativa. Ative-a para publicar serviços.");
    }

    // ----------------------------------------------------
    // 4️⃣ Prestador não verificado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given unverified provider should throw BadRequestException")]
    public void Handle_WhenProviderUnverified_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, isActive: true, isVerified: false);
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByUserIdAsync(user.Id)).ReturnsAsync(provider);

        var command = CreateValidCommand();

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Sua conta ainda não foi verificada. Aguarde a aprovação para publicar serviços.");
    }


}
