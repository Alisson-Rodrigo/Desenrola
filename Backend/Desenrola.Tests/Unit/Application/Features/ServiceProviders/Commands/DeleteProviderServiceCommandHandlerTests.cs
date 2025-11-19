using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.ServicesProviders.Commands.DeleteProviderServiceCommand;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.ServicesProviders.Commands;

public class DeleteProviderServiceCommandHandlerTests
{
    private readonly Mock<IProviderServiceRepository> _serviceRepositoryMock = new();
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<ILogged> _loggedMock = new();
    private readonly DeleteProviderServiceCommandHandler _sut;

    public DeleteProviderServiceCommandHandlerTests()
    {
        _sut = new DeleteProviderServiceCommandHandler(
            _serviceRepositoryMock.Object,
            _providerRepositoryMock.Object,
            _loggedMock.Object
        );
    }

    private static DeleteProviderServiceCommand CreateValidCommand(Guid id)
        => new() { Id = id };

    private static Domain.Entities.User CreateFakeUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "User Test",
        Email = "email@test.com",
        UserName = "tester"
    };

    private static Provider CreateFakeProvider(Domain.Entities.User user, bool verified = true)
        => new()
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            CPF = "12345678901",
            RG = "1234",
            Address = "Rua Teste",
            Categories = new List<Domain.Enums.ServiceCategory>(),
            ServiceName = "x",
            Description = "x",
            PhoneNumber = "x",
            DocumentPhotoUrl = new(),
            IsVerified = verified,
            IsActive = true
        };

    private static ProviderService CreateFakeService(Guid providerId)
        => new()
        {
            Id = Guid.NewGuid(),
            ProviderId = providerId,
            Title = "Serviço A",
            Description = "Desc",
            Price = 100,
            Category = Domain.Enums.ServiceCategory.Beleza,
            IsActive = true,
            IsAvailable = true
        };

    // ----------------------------------------------------
    // 1️⃣ Usuário não logado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given no logged user should throw BadRequestException")]
    public void Handle_WhenUserNotLogged_ShouldThrowBadRequestException()
    {
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync((Domain.Entities.User?)null);

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
            .WithMessage($"Serviço {command.Id} não encontrado.");
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
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id))
            .ReturnsAsync(service);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId))
            .ReturnsAsync((Provider?)null);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Você não tem permissão para alterar este serviço.");
    }

    // ----------------------------------------------------
    // 4️⃣ Provider não dono do serviço
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider is not the owner should throw BadRequestException")]
    public void Handle_WhenProviderIsNotOwner_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        var service = CreateFakeService(Guid.NewGuid());
        var providerDeOutroUsuario = CreateFakeProvider(CreateFakeUser()); // outro user

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId))
            .ReturnsAsync(providerDeOutroUsuario);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Você não tem permissão para alterar este serviço.");
    }

    // ----------------------------------------------------
    // 5️⃣ Provider não verificado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given unverified provider should throw BadRequestException")]
    public void Handle_WhenProviderNotVerified_ShouldThrowBadRequestException()
    {
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, verified: false);
        var service = CreateFakeService(provider.Id);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId)).ReturnsAsync(provider);

        var command = CreateValidCommand(service.Id);

        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Conta de prestador não está verificada. Não é possível inativar serviços.");
    }

    // ----------------------------------------------------
    // 6️⃣ Exclusão bem-sucedida
    // ----------------------------------------------------
    [Fact(DisplayName = "Given valid request should soft delete provider service successfully")]
    public async Task Handle_WhenValid_ShouldSoftDeleteService()
    {
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, verified: true);
        var service = CreateFakeService(provider.Id);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _serviceRepositoryMock.Setup(x => x.GetByIdAsync(service.Id)).ReturnsAsync(service);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(service.ProviderId)).ReturnsAsync(provider);
        _serviceRepositoryMock.Setup(x => x.Update(service)).Returns(Task.CompletedTask);

        var command = CreateValidCommand(service.Id);

        var result = await _sut.Handle(command, CancellationToken.None);

        result.Should().Be(MediatR.Unit.Value);
        service.IsActive.Should().BeFalse();

        _serviceRepositoryMock.Verify(x => x.Update(service), Times.Once);
    }
}
