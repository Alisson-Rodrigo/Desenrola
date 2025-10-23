using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Desenrola.Persistence.Repositories
{
    /// <summary>
    /// Repositório responsável pelas operações de persistência relacionadas à entidade <see cref="ProviderSchedule"/>.
    /// Implementa os métodos definidos em <see cref="IProviderScheduleRepository"/> para manipulação de horários e disponibilidade de prestadores.
    /// </summary>
    public class ProviderScheduleRepository : BaseRepository<ProviderSchedule>, IProviderScheduleRepository
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova instância do repositório de agendamentos de prestadores de serviço.
        /// </summary>
        /// <param name="context">Instância do contexto de banco de dados padrão (<see cref="DefaultContext"/>).</param>
        public ProviderScheduleRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém todos os horários disponíveis de um prestador de serviço específico.
        /// </summary>
        /// <param name="providerId">Identificador único do prestador (<see cref="Guid"/>).</param>
        /// <returns>
        /// Uma lista de objetos <see cref="ProviderSchedule"/> representando os horários disponíveis
        /// para o prestador informado.
        /// </returns>
        /// <remarks>
        /// O método retorna apenas horários com a propriedade <c>IsAvailable</c> igual a <c>true</c>,
        /// ou seja, que ainda não foram reservados.
        /// </remarks>
        public async Task<List<ProviderSchedule>> GetByProviderIdAsync(Guid providerId)
        {
            return await _context.ProviderSchedules
                .Where(s => s.ProviderId == providerId && s.IsAvailable)
                .ToListAsync();
        }

        /// <summary>
        /// Obtém um agendamento específico pelo seu identificador único.
        /// </summary>
        /// <param name="scheduleId">Identificador do agendamento (<see cref="Guid"/>).</param>
        /// <returns>
        /// Retorna o objeto <see cref="ProviderSchedule"/> correspondente ao <paramref name="scheduleId"/>,
        /// incluindo os dados do prestador (<see cref="ProviderSchedule.Provider"/>), 
        /// ou <c>null</c> se não for encontrado.
        /// </returns>
        public async Task<ProviderSchedule?> GetByIdAsync(Guid scheduleId)
        {
            return await _context.ProviderSchedules
                .Include(s => s.Provider) // Inclui informações do prestador associado
                .FirstOrDefaultAsync(s => s.Id == scheduleId);
        }
    }
}
