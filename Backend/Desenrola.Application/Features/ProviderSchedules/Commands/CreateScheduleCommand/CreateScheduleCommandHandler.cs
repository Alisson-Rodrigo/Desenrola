using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Commands.CreateScheduleCommand
{
    public class CreateScheduleCommandHandler : IRequestHandler<CreateScheduleCommand, Unit>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly IProviderScheduleRepository _scheduleRepository;

        public CreateScheduleCommandHandler(IProviderRepository providerRepository, IProviderScheduleRepository scheduleRepository)
        {
            _providerRepository = providerRepository;
            _scheduleRepository = scheduleRepository;
        }

        public async Task<Unit> Handle(CreateScheduleCommand request, CancellationToken cancellationToken)
        {
            var validator = new CreateScheduleCommandValidator();
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
                throw new BadRequestException(validationResult);

            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            var schedule = new ProviderSchedule
            {
                ProviderId = request.ProviderId,
                DayOfWeek = request.DayOfWeek,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                IsAvailable = true
            };

            await _scheduleRepository.CreateAsync(schedule);

            return Unit.Value;
        }
    }
}
