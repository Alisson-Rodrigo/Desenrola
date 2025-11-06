using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.Providers.Commands.MarkProviderVerifyCcommad;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.Providers.Commands;

public class MarkProviderVerifyCommandHandlerTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<IUserRepository> _userRepositoryMock = new();
    private readonly Mock<UserManager<Domain.Entities.User>> _userManagerMock;
    private readonly MarkProviderVerifyCommandHandler _sut;

    public MarkProviderVerifyCommandHandlerTests()
    {
        // Mock do UserManager requer parâmetros
        var userStoreMock = new Mock<IUserStore<Domain.Entities.User>>();
        _userManagerMock = new Mock<UserManager<Domain.Entities.User>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null
        );

        _sut = new MarkProviderVerifyCommandHandler(
            _providerRepositoryMock.Object,
            _userRepositoryMock.Object,
            _userManagerMock.Object
        );
    }

    private static Provider CreateFakeProvider(bool verified = false) => new()
    {
        Id = Guid.NewGuid(),
        UserId = Guid.NewGuid().ToString(),
        CPF = "12345678901",
        RG = "1234567",
        Address = "Rua Teste",
        Categories = new(),
        ServiceName = "Serviço Teste",
        Description = "Descrição",
        PhoneNumber = "+5511999999999",
        DocumentPhotoUrl = new(),
        IsActive = true,
        IsVerified = verified
    };

    private static Domain.Entities.User CreateFakeUser(string id) => new()
    {
        Id = id,
        Name = "User Test",
        Email = "user@email.com",
        UserName = "user_test"
    };

    // ----------------------------------------------------
    // 1️⃣ Prestador não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not found should throw BadRequestException")]
    public void Handle_WhenProviderNotFound_ShouldThrowBadRequestException()
    {
        // Arrange
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Provider?)null);

        var command = new MarkProviderVerifyCommand { Id = Guid.NewGuid(), Operation = true };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Prestador não foi encontrado.");
    }

    // ----------------------------------------------------
    // 2️⃣ Prestador já verificado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given already verified provider should throw BadRequestException")]
    public void Handle_WhenProviderAlreadyVerified_ShouldThrowBadRequestException()
    {
        // Arrange
        var provider = CreateFakeProvider(verified: true);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        var command = new MarkProviderVerifyCommand { Id = provider.Id, Operation = true };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Prestador já está verificado.");
    }

    // ----------------------------------------------------
    // 3️⃣ Operação = false → exclusão lógica (Delete)
    // ----------------------------------------------------
    [Fact(DisplayName = "Given operation false should delete provider and return Unit")]
    public async Task Handle_WhenOperationIsFalse_ShouldDeleteProvider()
    {
        // Arrange
        var provider = CreateFakeProvider();

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);
        _providerRepositoryMock.Setup(x => x.Delete(provider)).Returns(Task.CompletedTask);

        var command = new MarkProviderVerifyCommand { Id = provider.Id, Operation = false };

        // Act
        var result = await _sut.Handle(command, new CancellationToken());

        // Assert
        result.Should().Be(MediatR.Unit.Value);
        _providerRepositoryMock.Verify(x => x.Delete(It.IsAny<Provider>()), Times.Once);
    }

    // ----------------------------------------------------
    // 4️⃣ Operação = true → marca como verificado e adiciona role
    // ----------------------------------------------------
    [Fact(DisplayName = "Given operation true should verify provider and assign Provider role")]
    public async Task Handle_WhenOperationIsTrue_ShouldVerifyAndAssignRole()
    {
        // Arrange
        var provider = CreateFakeProvider(verified: false);
        var user = CreateFakeUser(provider.UserId);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        _providerRepositoryMock.Setup(x => x.Update(provider))
            .Returns(Task.CompletedTask);

        _userManagerMock.Setup(x => x.FindByIdAsync(provider.UserId))
            .ReturnsAsync(user);
        _userManagerMock.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string>()); // sem roles
        _userManagerMock.Setup(x => x.AddToRoleAsync(user, "Provider"))
            .ReturnsAsync(IdentityResult.Success);

        var command = new MarkProviderVerifyCommand { Id = provider.Id, Operation = true };

        // Act
        var result = await _sut.Handle(command, new CancellationToken());

        // Assert
        result.Should().Be(MediatR.Unit.Value);
        provider.IsVerified.Should().BeTrue();
        provider.IsActive.Should().BeTrue();
        _providerRepositoryMock.Verify(x => x.Update(It.IsAny<Provider>()), Times.Once);
        _userManagerMock.Verify(x => x.AddToRoleAsync(user, "Provider"), Times.Once);
    }

    // ----------------------------------------------------
    // 5️⃣ Falha ao atribuir role Provider
    // ----------------------------------------------------
    [Fact(DisplayName = "Given AddToRoleAsync fails should throw BadRequestException")]
    public void Handle_WhenAddToRoleFails_ShouldThrowBadRequestException()
    {
        // Arrange
        var provider = CreateFakeProvider(verified: false);
        var user = CreateFakeUser(provider.UserId);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        _providerRepositoryMock.Setup(x => x.Update(provider))
            .Returns(Task.CompletedTask);

        _userManagerMock.Setup(x => x.FindByIdAsync(provider.UserId))
            .ReturnsAsync(user);
        _userManagerMock.Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string>());
        _userManagerMock.Setup(x => x.AddToRoleAsync(user, "Provider"))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Erro" }));

        var command = new MarkProviderVerifyCommand { Id = provider.Id, Operation = true };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Erro ao atribuir role 'Provider' ao usuário.");
    }
}
