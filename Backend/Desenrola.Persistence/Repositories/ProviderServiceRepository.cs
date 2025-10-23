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
    /// Repositório responsável pelas operações de persistência da entidade <see cref="ProviderService"/>.
    /// Implementa os métodos definidos em <see cref="IProviderServiceRepository"/> 
    /// para consulta e gerenciamento de serviços cadastrados por prestadores.
    /// </summary>
    public class ProviderServiceRepository : BaseRepository<ProviderService>, IProviderServiceRepository
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova instância do repositório de serviços de prestadores.
        /// </summary>
        /// <param name="context">Instância do contexto de banco de dados (<see cref="DefaultContext"/>).</param>
        public ProviderServiceRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém um serviço específico pelo seu identificador único.
        /// </summary>
        /// <param name="id">Identificador do serviço (<see cref="Guid"/>).</param>
        /// <returns>
        /// Retorna o objeto <see cref="ProviderService"/> correspondente ao <paramref name="id"/>,
        /// incluindo os dados do prestador (<see cref="ProviderService.Provider"/>) e do usuário vinculado,
        /// ou <c>null</c> se não for encontrado.
        /// </returns>
        public async Task<ProviderService?> GetByIdAsync(Guid id)
        {
            return await _context.ProviderServices
                .Include(s => s.Provider)      // Inclui o prestador dono do serviço
                .ThenInclude(p => p.User)      // Inclui o usuário vinculado ao prestador
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        /// <summary>
        /// Retorna uma consulta (queryable) com todos os serviços e seus relacionamentos incluídos,
        /// permitindo paginação e filtragem de forma otimizada.
        /// </summary>
        /// <returns>
        /// Um objeto <see cref="IQueryable{ProviderService}"/> contendo os serviços com:
        /// <list type="bullet">
        /// <item><description><c>Provider</c> — informações do prestador que oferece o serviço.</description></item>
        /// <item><description><c>User</c> — informações do usuário vinculado ao prestador.</description></item>
        /// </list>
        /// Essa consulta é executada com <c>AsNoTracking()</c> para melhorar o desempenho em operações de leitura.
        /// </returns>
        public IQueryable<ProviderService> QueryAllWithIncludes()
        {
            return _context.ProviderServices
                .Include(s => s.Provider)      // Inclui o prestador
                .ThenInclude(p => p.User)      // Inclui o usuário vinculado
                .AsNoTracking()
                .AsQueryable();
        }
    }
}
