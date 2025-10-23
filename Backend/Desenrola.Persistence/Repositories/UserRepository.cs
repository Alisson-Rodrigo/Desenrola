using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Desenrola.Persistence.Repositories
{
    /// <summary>
    /// Implementação do repositório responsável pelas operações de persistência da entidade <see cref="User"/>.
    /// </summary>
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        /// <summary>
        /// Inicializa uma nova instância do repositório de usuários.
        /// </summary>
        /// <param name="context">
        /// O contexto do banco de dados utilizado para acessar e manipular os dados dos usuários.
        /// </param>
        public UserRepository(DefaultContext context) : base(context)
        {
        }

        /// <summary>
        /// Recupera um usuário específico pelo seu identificador único (ID).
        /// </summary>
        /// <param name="id">O identificador único do usuário.</param>
        /// <returns>
        /// Um objeto <see cref="User"/> correspondente ao ID informado, ou <c>null</c> se não for encontrado.
        /// </returns>
        public async Task<User?> GetById(string id)
        {
            return await Context.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
