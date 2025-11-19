using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.ProviderSchedules.Commands.UpdateScheduleCommand;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using FluentAssertions;
using MediatR;
using Moq;

namespace Desenrola.Tests.Unit.Application.Features.ProviderSchedules.Commands;

public class UpdateScheduleCommandHandlerTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock = new();
    private readonly Mock<IProviderScheduleRepository> _scheduleRepositoryMock = new();
    private readonly UpdateScheduleCommandHandler _sut;

    public UpdateScheduleCommandHandlerTests()
    {
        _sut = new UpdateScheduleCommandHandler(
            _providerRepositoryMock.Object,
            _scheduleRepositoryMock.Object
        );
    }

    private static UpdateScheduleCommand CreateValidCommand(Guid providerId, Guid scheduleId) =>
        new()
        {
            ProviderId = providerId,
            ScheduleId = scheduleId,
            DayOfWeek = WeekDay.Friday,
            StartTime = "08:00:00",
            EndTime = "12:00:00",
            IsAvailable = true
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

    private static ProviderSchedule CreateFakeSchedule(Guid scheduleId, Guid providerId) =>
        new()
        {
            Id = scheduleId,
            ProviderId = providerId,
            DayOfWeek = WeekDay.Friday,
            StartTime = TimeSpan.Parse("09:00:00"),
            EndTime = TimeSpan.Parse("10:00:00"),
            IsAvailable = true
        };

    // ----------------------------------------------------
    // 1️⃣ Validação inválida
    // ----------------------------------------------------
    [Fact(DisplayName = "Given invalid model should throw BadRequestException")]
    public void Handle_WhenValidationFails_ShouldThrowBadRequestException()
    {
        var command = new UpdateScheduleCommand
        {
            ProviderId = Guid.NewGuid(),
            ScheduleId = Guid.NewGuid(),
            DayOfWeek = WeekDay.Friday,
            StartTime = "10:00:00",
            EndTime = "08:00:00", // inválido
            IsAvailable = true
        };

        Func<Task> action = async () =>
            await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>();
    }

    // ----------------------------------------------------
    // 2️⃣ Provider não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given provider not found should throw BadRequestException")]
    public void Handle_WhenProviderNotFound_ShouldThrowBadRequestException()
    {
        var providerId = Guid.NewGuid();
        var scheduleId = Guid.NewGuid();
        var command = CreateValidCommand(providerId, scheduleId);

        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync((Provider?)null);

        Func<Task> action = async () =>
            await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Prestador não encontrado.");
    }

    // ----------------------------------------------------
    // 3️⃣ Schedule não encontrado
    // ----------------------------------------------------
    [Fact(DisplayName = "Given schedule not found should throw BadRequestException")]
    public void Handle_WhenScheduleNotFound_ShouldThrowBadRequestException()
    {
        var providerId = Guid.NewGuid();
        var scheduleId = Guid.NewGuid();
        var command = CreateValidCommand(providerId, scheduleId);

        var provider = CreateFakeProvider(providerId);

        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync(provider);

        _scheduleRepositoryMock
            .Setup(x => x.GetByIdAsync(scheduleId))
            .ReturnsAsync((ProviderSchedule?)null);

        Func<Task> action = async () =>
            await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Agenda não encontrada para este prestador.");
    }

    // ----------------------------------------------------
    // 4️⃣ Schedule existe, mas pertence a outro provider
    // ----------------------------------------------------
    [Fact(DisplayName = "Given schedule of another provider should throw BadRequestException")]
    public void Handle_WhenScheduleDoesNotBelongToProvider_ShouldThrowBadRequestException()
    {
        var providerId = Guid.NewGuid();
        var scheduleId = Guid.NewGuid();
        var command = CreateValidCommand(providerId, scheduleId);

        var provider = CreateFakeProvider(providerId);

        var schedule = CreateFakeSchedule(scheduleId, Guid.NewGuid()); // <-- provider errado

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(providerId)).ReturnsAsync(provider);
        _scheduleRepositoryMock.Setup(x => x.GetByIdAsync(scheduleId)).ReturnsAsync(schedule);

        Func<Task> action = async () =>
            await _sut.Handle(command, CancellationToken.None);

        action.Should().ThrowAsync<BadRequestException>()
            .WithMessage("Agenda não encontrada para este prestador.");
    }

    // ----------------------------------------------------
    // 5️⃣ Atualização bem-sucedida
    // ----------------------------------------------------
    [Fact(DisplayName = "Given valid data should update schedule successfully")]
    public async Task Handle_WhenValid_ShouldUpdateScheduleSuccessfully()
    {
        var providerId = Guid.NewGuid();
        var scheduleId = Guid.NewGuid();
        var command = CreateValidCommand(providerId, scheduleId);

        var provider = CreateFakeProvider(providerId);
        var schedule = CreateFakeSchedule(scheduleId, providerId);

        _providerRepositoryMock.Setup(x => x.GetByIdAsync(providerId)).ReturnsAsync(provider);
        _scheduleRepositoryMock.Setup(x => x.GetByIdAsync(scheduleId)).ReturnsAsync(schedule);
        _scheduleRepositoryMock.Setup(x => x.Update(It.IsAny<ProviderSchedule>()))
            .Returns(Task.CompletedTask);

        var result = await _sut.Handle(command, CancellationToken.None);

        result.Should().Be(MediatR.Unit.Value);

        _scheduleRepositoryMock.Verify(
            x => x.Update(It.Is<ProviderSchedule>(s =>
                s.Id == scheduleId &&
                s.ProviderId == providerId &&
                s.DayOfWeek == command.DayOfWeek &&
                s.StartTime == TimeSpan.Parse(command.StartTime) &&
                s.EndTime == TimeSpan.Parse(command.EndTime) &&
                s.IsAvailable == command.IsAvailable
            )),
            Times.Once
        );
    }
}
