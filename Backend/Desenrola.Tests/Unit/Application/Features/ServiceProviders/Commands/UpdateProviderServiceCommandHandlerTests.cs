using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.ServicesProviders.Commands.UpdateServiceProviderCommand;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.ServicesProviders.Commands;

public class UpdateProviderServiceCommandHandlerTests
{
    private readonly Mock<IProviderServiceRepository> _serviceRepositoryMock = new();
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<ILogged> _loggedMock = new();
    private readonly UpdateProviderServiceCommandHandler _sut;

    public UpdateProviderServiceCommandHandlerTests()
    {
        _sut = new UpdateProviderServiceCommandHandler(
            _serviceRepositoryMock.Object,
            _providerRepositoryMock.Object,
            _loggedMock.Object
        );
    }

    private static UpdateProviderServiceCommand CreateValidCommand(Guid id) =>
        new(
            Id: id,
            Title: "Serviço Atualizado",
            Description: "Descrição Atualizada",
            Price: 150,
            Category: ServiceCategory.Beleza,
            IsActive: true,
            IsAvailable: true
        );

    private static Domain.Entities.User CreateFakeUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        Email = "user@email.com",
        UserName = "user_test",
        Name = "User Test"
    };

    private static Provider CreateFakeProvider(Domain.Entities.User user, bool active = true, bool verified = true) =>
        new()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CPF = "12345678901",
            RG = "1234567",
            Address = "Rua Teste",
            Categories = new List<ServiceCategory>(),
            ServiceName = "Serviço Teste",
            Description = "Desc",
            PhoneNumber = "9999",
            DocumentPhotoUrl = new List<string>(),
            IsActive = active,
            IsVerified = verified
        };

    private static ProviderService CreateFakeService(Guid providerId) =>
        new()
        {
            Id = Guid.NewGuid(),
            ProviderId = providerId,
            Title = "Antigo",
            Description = "Antiga",
            Category = ServiceCategory.Beleza,
            Price = 50,
            IsActive = true,
            IsAvailable = true
        };

    // ----------------------------------------------------
    // 1️⃣ Usuário não logado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given no logged user should throw BadRequestException")]
    public void Handle_WhenUserNotLogged_ShouldThrowBadRequestException()
    {
        _loggedMock.Setup(x => x.UserLogged())
            .ReturnsAsync((Domain.Entities.User?)null);

        var command = CreateValidCommand(Guid.NewGuid());

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Usuário não encontrado.");
    }

    // ----------------------------------------------------
    // 2️⃣ Serviço não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given service not found should throw BadRequestException")]
    public void Handle_WhenServiceNotFound_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);

        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((ProviderService?)null);

        var command = CreateValidCommand(Guid.NewGuid());

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Serviço não encontrado.");
    }

    // ----------------------------------------------------
    // 3️⃣ Provider não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not found should throw BadRequestException")]
    public void Handle_WhenProviderNotFound_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        var service = CreateFakeService(Guid.NewGuid());

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId))
            .ReturnsAsync((Provider?)null);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Você não tem permissão para atualizar este serviço.");
    }

    // ----------------------------------------------------
    // 4️⃣ Provider não é dono do serviço
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider is not the owner should throw BadRequestException")]
    public void Handle_WhenNotOwner_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        var service = CreateFakeService(Guid.NewGuid());
        var provider = CreateFakeProvider(CreateFakeUser()); // outro usuário

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId)).ReturnsAsync(provider);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Você não tem permissão para atualizar este serviço.");
    }

    // ----------------------------------------------------
    // 5️⃣ Provider inativo
    // ----------------------------------------------------
    [Fact(DisplayName = "Given inactive provider should throw BadRequestException")]
    public void Handle_WhenProviderInactive_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        var inactiveProvider = CreateFakeProvider(user, active: false);
        var service = CreateFakeService(inactiveProvider.Id);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId)).ReturnsAsync(inactiveProvider);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Conta de prestador está inativa.");
    }

    // ----------------------------------------------------
    // 6️⃣ Provider não verificado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given unverified provider should throw BadRequestException")]
    public void Handle_WhenProviderNotVerified_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, active: true, verified: false);
        var service = CreateFakeService(provider.Id);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId)).ReturnsAsync(provider);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Conta de prestador não foi verificada.");
    }

    // ----------------------------------------------------
    // 7️⃣ Atualização bem-sucedida
    // ----------------------------------------------------
    [Fact(DisplayName = "Given valid data should update provider service successfully")]
    public async Task Handle_WhenValidData_ShouldUpdateSuccessfully()
    {
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user);
        var service = CreateFakeService(provider.Id);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);

        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId))
            .ReturnsAsync(provider);

        _serviceRepositoryMock.Setup(x => x.Update(It.IsAny<ProviderService>()))
            .Returns(Task.CompletedTask);

        var command = CreateValidCommand(service.Id);

        var result = await _sut.Handle(command, CancellationToken.None);

        result.Should().Be(service.Id);
        _serviceRepositoryMock.Verify(x => x.Update(service), Times.Once);
    }
}
