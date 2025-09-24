using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ProviderSchedules.Queries.GetSchedulesByProviderQuery
{
    public class GetSchedulesByProviderQueryHandler
        : IRequestHandler<GetSchedulesByProviderQuery, List<GetScheduleResult>>
    {
        private readonly IProviderRepository _providerRepository;
        private readonly IProviderScheduleRepository _scheduleRepository;

        public GetSchedulesByProviderQueryHandler(
            IProviderRepository providerRepository,
            IProviderScheduleRepository scheduleRepository)
        {
            _providerRepository = providerRepository;
            _scheduleRepository = scheduleRepository;
        }

        public async Task<List<GetScheduleResult>> Handle(GetSchedulesByProviderQuery request, CancellationToken cancellationToken)
        {
            var provider = await _providerRepository.GetByIdAsync(request.ProviderId);
            if (provider == null)
                throw new BadRequestException("Prestador não encontrado.");

            var schedules = await _scheduleRepository.GetByProviderIdAsync(request.ProviderId);

            return schedules
                .Select(s => new GetScheduleResult
                {
                    Id = s.Id,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime.ToString(@"hh\:mm"),
                    EndTime = s.EndTime.ToString(@"hh\:mm"),
                    IsAvailable = s.IsAvailable
                })
                .OrderBy(s => s.DayOfWeek == WeekDay.Sunday ? 7 : (int)s.DayOfWeek) // força domingo pro fim
                .ToList();

        }
    }
}
