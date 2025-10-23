using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories
{
    /// <summary>
    /// Repositório responsável pelas operações de persistência relacionadas à entidade <see cref="Provider"/>.
    /// Implementa os métodos definidos em <see cref="IProviderRepository"/> para consulta e gerenciamento de prestadores de serviço.
    /// </summary>
    public class ProviderRepository : BaseRepository<Provider>, IProviderRepository
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova instância do repositório de prestadores de serviço.
        /// </summary>
        /// <param name="context">Instância do contexto de banco de dados padrão (<see cref="DefaultContext"/>).</param>
        public ProviderRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém um prestador de serviço com base no identificador do usuário associado.
        /// </summary>
        /// <param name="userId">Identificador do usuário vinculado ao prestador.</param>
        /// <returns>
        /// Retorna o objeto <see cref="Provider"/> correspondente ao <paramref name="userId"/>,
        /// incluindo os dados do usuário (<see cref="Provider.User"/>), ou <c>null</c> se não encontrado.
        /// </returns>
        public async Task<Provider?> GetByUserIdAsync(string userId)
        {
            return await _context.Providers
                .Include(p => p.User)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        /// <summary>
        /// Obtém um prestador de serviço com base no seu identificador único.
        /// </summary>
        /// <param name="id">Identificador do prestador (<see cref="Guid"/>).</param>
        /// <returns>
        /// Retorna o objeto <see cref="Provider"/> correspondente ao <paramref name="id"/>,
        /// ou <c>null</c> se não encontrado.
        /// </returns>
        public async Task<Provider?> GetByIdAsync(Guid id)
        {
            return await _context.Providers
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        /// <summary>
        /// Retorna uma consulta (queryable) contendo todos os prestadores com seus relacionamentos incluídos.
        /// </summary>
        /// <returns>
        /// Um objeto <see cref="IQueryable{Provider}"/> contendo todos os prestadores com as seguintes inclusões:
        /// <list type="bullet">
        /// <item><description><c>User</c> — inclui os dados de autenticação e perfil do usuário associado ao prestador.</description></item>
        /// <item><description><c>Services</c> — inclui a lista de serviços oferecidos pelo prestador.</description></item>
        /// </list>
        /// Essa consulta é executada em modo <c>AsNoTracking</c> para otimizar performance em leituras.
        /// </returns>
        public IQueryable<Provider> QueryAllWithIncludes()
        {
            return _context.Providers
                .Include(p => p.User)       // Inclui o usuário vinculado ao prestador
                .Include(p => p.Services)   // Inclui os serviços cadastrados do prestador
                .AsNoTracking()
                .AsQueryable();
        }
    }
}
