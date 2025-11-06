using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.Providers.Commands.UpdateProvider;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.Providers.Commands;

public class UpdateProviderCommandHandlerTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<ILogged> _loggedMock = new();
    private readonly Mock<ICPF> _cpfValidatorMock = new();
    private readonly UpdateProviderCommandHandler _sut;

    public UpdateProviderCommandHandlerTests()
    {
        _sut = new UpdateProviderCommandHandler(
            _providerRepositoryMock.Object,
            _loggedMock.Object,
            _cpfValidatorMock.Object
        );
    }

    // 🔹 Comando válido auxiliar
    private static UpdateProviderCommand CreateValidCommand(Guid id)
    {
        return new UpdateProviderCommand(
            Id: id,
            CPF: "12345678901",
            RG: "1234567",
            Address: "Rua Atualizada, 123",
            Categories: new List<ServiceCategory> { ServiceCategory.Beleza },
            ServiceName: "Serviço Atualizado",
            Description: "Descrição atualizada",
            PhoneNumber: "+5511999999999"
        );
    }

    private static Domain.Entities.User CreateFakeUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "User Test",
        Email = "user@email.com",
        UserName = "user_test"
    };

    private static Provider CreateFakeProvider(Domain.Entities.User user, bool isVerified = true) => new()
    {
        Id = Guid.NewGuid(),
        UserId = user.Id,
        CPF = "11111111111",
        RG = "0000000",
        Address = "Rua Antiga, 321",
        Categories = new List<ServiceCategory>(),
        ServiceName = "Serviço Antigo",
        Description = "Descrição antiga",
        PhoneNumber = "+55000000000",
        DocumentPhotoUrl = new(),
        IsActive = true,
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

        var command = CreateValidCommand(Guid.NewGuid());

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Usuário não encontrado.");
    }

    // ----------------------------------------------------
    // 2️⃣ Provider não pertence ao usuário logado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not owned by user should throw BadRequestException")]
    public void Handle_WhenProviderNotOwnedByUser_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = CreateFakeUser();
        var otherUser = CreateFakeUser(); // outro dono
        var provider = CreateFakeProvider(otherUser);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);

        var command = CreateValidCommand(provider.Id);
        _cpfValidatorMock.Setup(x => x.IsValidCPF(It.IsAny<string>())).Returns(true);

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Prestador não encontrado ou não pertence ao usuário logado.");
    }

    // ----------------------------------------------------
    // 3️⃣ Provider não verificado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given unverified provider should throw BadRequestException")]
    public void Handle_WhenProviderNotVerified_ShouldThrowBadRequestException()
    {
        // Arrange
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, isVerified: false);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);
        _cpfValidatorMock.Setup(x => x.IsValidCPF(It.IsAny<string>())).Returns(true);

        var command = CreateValidCommand(provider.Id);

        // Act
        Func<Task> action = async () => await _sut.Handle(command, new CancellationToken());

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Seu cadastro ainda não foi verificado. Aguarde aprovação para atualizar as informações.");
    }

    // ----------------------------------------------------
    // 4️⃣ Atualização bem-sucedida
    // ----------------------------------------------------
    [Fact(DisplayName = "Given valid data and verified provider should update successfully")]
    public async Task Handle_WhenValidAndVerified_ShouldUpdateSuccessfully()
    {
        // Arrange
        var user = CreateFakeUser();
        var provider = CreateFakeProvider(user, isVerified: true);

        _loggedMock.Setup(x => x.UserLogged()).ReturnsAsync(user);
        _providerRepositoryMock.Setup(x => x.GetByIdAsync(provider.Id))
            .ReturnsAsync(provider);
        _cpfValidatorMock.Setup(x => x.IsValidCPF(It.IsAny<string>())).Returns(true);

        _providerRepositoryMock.Setup(x => x.Update(provider)).Returns(Task.CompletedTask);

        var command = CreateValidCommand(provider.Id);

        // Act
        var result = await _sut.Handle(command, new CancellationToken());

        // Assert
        result.Should().Be(provider.Id);
        _providerRepositoryMock.Verify(x => x.Update(It.IsAny<Provider>()), Times.Once);
    }
}
