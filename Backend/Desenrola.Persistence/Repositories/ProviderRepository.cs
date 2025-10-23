using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories
{
    /// <summary>
    /// Reposit�rio respons�vel pelas opera��es de persist�ncia relacionadas � entidade <see cref="Provider"/>.
    /// Implementa os m�todos definidos em <see cref="IProviderRepository"/> para consulta e gerenciamento de prestadores de servi�o.
    /// </summary>
    public class ProviderRepository : BaseRepository<Provider>, IProviderRepository
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova inst�ncia do reposit�rio de prestadores de servi�o.
        /// </summary>
        /// <param name="context">Inst�ncia do contexto de banco de dados padr�o (<see cref="DefaultContext"/>).</param>
        public ProviderRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Obt�m um prestador de servi�o com base no identificador do usu�rio associado.
        /// </summary>
        /// <param name="userId">Identificador do usu�rio vinculado ao prestador.</param>
        /// <returns>
        /// Retorna o objeto <see cref="Provider"/> correspondente ao <paramref name="userId"/>,
        /// incluindo os dados do usu�rio (<see cref="Provider.User"/>), ou <c>null</c> se n�o encontrado.
        /// </returns>
        public async Task<Provider?> GetByUserIdAsync(string userId)
        {
            return await _context.Providers
                .Include(p => p.User)
                .FirstOrDefaultAsync(x => x.UserId == userId);
        }

        /// <summary>
        /// Obt�m um prestador de servi�o com base no seu identificador �nico.
        /// </summary>
        /// <param name="id">Identificador do prestador (<see cref="Guid"/>).</param>
        /// <returns>
        /// Retorna o objeto <see cref="Provider"/> correspondente ao <paramref name="id"/>,
        /// ou <c>null</c> se n�o encontrado.
        /// </returns>
        public async Task<Provider?> GetByIdAsync(Guid id)
        {
            return await _context.Providers
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        /// <summary>
        /// Retorna uma consulta (queryable) contendo todos os prestadores com seus relacionamentos inclu�dos.
        /// </summary>
        /// <returns>
        /// Um objeto <see cref="IQueryable{Provider}"/> contendo todos os prestadores com as seguintes inclus�es:
        /// <list type="bullet">
        /// <item><description><c>User</c> � inclui os dados de autentica��o e perfil do usu�rio associado ao prestador.</description></item>
        /// <item><description><c>Services</c> � inclui a lista de servi�os oferecidos pelo prestador.</description></item>
        /// </list>
        /// Essa consulta � executada em modo <c>AsNoTracking</c> para otimizar performance em leituras.
        /// </returns>
        public IQueryable<Provider> QueryAllWithIncludes()
        {
            return _context.Providers
                .Include(p => p.User)       // Inclui o usu�rio vinculado ao prestador
                .Include(p => p.Services)   // Inclui os servi�os cadastrados do prestador
                .AsNoTracking()
                .AsQueryable();
        }
    }
}
