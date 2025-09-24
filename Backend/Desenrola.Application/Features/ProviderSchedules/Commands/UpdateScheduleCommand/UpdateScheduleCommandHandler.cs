using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.UpdateScheduleCommand
{
    public class UpdateScheduleCommandHandler : IRequestHandler<UpdateScheduleCommand, Unit>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly IProviderScheduleRepository _scheduleRepository;

        public UpdateScheduleCommandHandler(
            IProviderRepository providerRepository,
            IProviderScheduleRepository scheduleRepository)
        {
            _providerRepository = providerRepository;
            _scheduleRepository = scheduleRepository;
        }

        public async Task<Unit> Handle(UpdateScheduleCommand request, CancellationToken cancellationToken)
        {
            var validator = new UpdateScheduleCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            var schedule = await _scheduleRepository.GetByIdAsync(request.ScheduleId);

            if (schedule == null || schedule.ProviderId != request.ProviderId)
                throw new BadRequestException("Agenda não encontrada para este prestador.");


            // Atualiza os campos
            schedule.DayOfWeek = request.DayOfWeek;
            schedule.StartTime = request.StartTime;
            schedule.EndTime = request.EndTime;
            schedule.IsAvailable = request.IsAvailable;

            await _scheduleRepository.Update(schedule);

            return Unit.Value;
        }
    }
}
