using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.ProviderSchedules.Commands.CreateScheduleCommand;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using FluentAssertions;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.ProviderSchedules.Commands;

public class CreateScheduleCommandHandlerTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<IProviderScheduleRepository> _scheduleRepositoryMock = new();
    private readonly CreateScheduleCommandHandler _sut;

    public CreateScheduleCommandHandlerTests()
    {
        _sut = new CreateScheduleCommandHandler(
            _providerRepositoryMock.Object,
            _scheduleRepositoryMock.Object
        );
    }

    private static CreateScheduleCommand CreateValidCommand(Guid providerId) =>
        new()
        {
            ProviderId = providerId,
            DayOfWeek = WeekDay.Friday,
            StartTime = "08:00:00",
            EndTime = "12:00:00"
        };

    private static Provider CreateFakeProvider(Guid id) =>
        new()
        {
            Id = id,
            UserId = Guid.NewGuid().ToString(),
            CPF = "12345678901",
            RG = "12345",
            Address = "Rua Teste",
            Categories = new(),
            ServiceName = "Serviço Teste",
            Description = "Desc",
            PhoneNumber = "9999",
            DocumentPhotoUrl = new(),
            IsActive = true,
            IsVerified = true
        };

    // ----------------------------------------------------
    // 1️⃣ Validação inválida (ex.: horário final menor que inicial)
    // ----------------------------------------------------
    [Fact(DisplayName = "Given invalid times should throw BadRequestException")]
    public void Handle_WhenValidationFails_ShouldThrowBadRequestException()
    {
        // Arrange
        var command = new CreateScheduleCommand
        {
            ProviderId = Guid.NewGuid(),
            DayOfWeek = WeekDay.Friday,
            StartTime = "10:00:00",
            EndTime = "08:00:00" // inválido
        };

        // Act
        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        // Assert
        action.Should().ThrowAsync<BadRequestException>();
    }

    // ----------------------------------------------------
    // 2️⃣ Provider não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not found should throw BadRequestException")]
    public void Handle_WhenProviderNotFound_ShouldThrowBadRequestException()
    {
        // Arrange
        var providerId = Guid.NewGuid();
        var command = CreateValidCommand(providerId);

        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync((Provider?)null);

        // Act
        Func<Task> action = async () => await _sut.Handle(command, CancellationToken.None);

        // Assert
        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Prestador não encontrado.");
    }

}
