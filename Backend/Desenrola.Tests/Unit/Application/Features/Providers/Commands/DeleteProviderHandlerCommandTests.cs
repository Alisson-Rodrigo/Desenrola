using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.Providers.Commands.DeleteProviderCommand;
using Desenrola.Domain.Entities;
using FluentAssertions;
using MediatR;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.Providers.Commands;

public class DeleteProviderHandlerCommandTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<ILogged> _loggedMock = new();
    private readonly DeleteProviderHandlerCommand _sut;

    public DeleteProviderHandlerCommandTests()
    {
        _sut = new DeleteProviderHandlerCommand(
            _providerRepositoryMock.Object,
            _loggedMock.Object
        );
    }

    private static Domain.Entities.User CreateFakeUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "User Test",
        Email = "user@email.com",
        UserName = "user_test"
    };

    private static Provider CreateFakeProvider(Domain.Entities.User user, bool isActive = true) => new()
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        CPF = "12345678901",
        RG = "1234567",
        Address = "Rua Teste",
        Categories = new(),
        ServiceName = "Serviço Teste",
        Description = "Descrição Teste",
        PhoneNumber = "+5511999999999",
        DocumentPhotoUrl = new(),
        IsActive = isActive,
        IsVerified = true
    };

    // ----------------------------------------------------
    // 1️⃣ Prestador não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not found should throw Exception")]
    public void Handle_WhenProviderNotFound_ShouldThrowException()
    {
        // Arrange
        var user = CreateFakeUser();
        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Provider?)null);

        var command = new DeleteProviderCommand { Id = Guid.NewGuid() };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<Exception>()
            .WithMessage("Prestador não encontrado");
    }

    // ----------------------------------------------------
    // 2️⃣ Prestador não pertence ao usuário logado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not owned by user should throw Exception")]
    public void Handle_WhenProviderNotOwnedByUser_ShouldThrowException()
    {
        // Arrange
        var user = CreateFakeUser();
        var otherUser = CreateFakeUser();
        var provider = CreateFakeProvider(otherUser);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        var command = new DeleteProviderCommand { Id = provider.Id };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<Exception>()
            .WithMessage("Prestador não pertence ao usuário logado");
    }

    // ----------------------------------------------------
    // 3️⃣ Prestador já inativo
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider already inactive should throw Exception")]
    public void Handle_WhenProviderAlreadyInactive_ShouldThrowException()
    {
        // Arrange
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, isActive: false);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        var command = new DeleteProviderCommand { Id = provider.Id };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<Exception>()
            .WithMessage("Prestador já está inativo");
    }

    // ----------------------------------------------------
    // 4️⃣ Exclusão (inativação) bem-sucedida
    // ----------------------------------------------------
    [Fact(DisplayName = "Given valid provider should set inactive and update successfully")]
    public async Task Handle_WhenValidProvider_ShouldSetInactiveAndUpdate()
    {
        // Arrange
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, isActive: true);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        _providerRepositoryMock.Setup(x => x.Update(provider))
            .Returns(Task.CompletedTask);

        var command = new DeleteProviderCommand { Id = provider.Id };

        // Act
        var result = await _sut.Handle(command, new CancellationToken());

        // Assert
        result.Should().Be(MediatR.Unit.Value);
        provider.IsActive.Should().BeFalse();
        _providerRepositoryMock.Verify(x => x.Update(It.Is<Provider>(p => p.Id == provider.Id && p.IsActive == false)), Times.Once);
    }
}
