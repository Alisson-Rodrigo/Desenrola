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
    /// Repositório responsável pelas operações de persistência relacionadas à entidade <see cref="Favorite"/>.
    /// Implementa os métodos definidos em <see cref="IFavoriteRepository"/> para manipular favoritos de usuários.
    /// </summary>
    public class FavoriteRepository : BaseRepository<Favorite>, IFavoriteRepository
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova instância do repositório de favoritos.
        /// </summary>
        /// <param name="context">Instância do contexto de banco de dados padrão (<see cref="DefaultContext"/>).</param>
        public FavoriteRepository(DefaultContext context) : base(context)
        {
            _context = context;
        }

        /// <summary>
        /// Verifica se um provedor já foi favoritado por um usuário específico.
        /// </summary>
        /// <param name="userId">Identificador do usuário autenticado.</param>
        /// <param name="providerId">Identificador do provedor a ser verificado.</param>
        /// <returns>
        /// Retorna <c>true</c> se o provedor já estiver favoritado pelo usuário; caso contrário, <c>false</c>.
        /// </returns>
        public async Task<bool> Exists(string userId, Guid providerId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.ProviderId == providerId);
        }

        /// <summary>
        /// Obtém um favorito específico com base no identificador do usuário e do provedor.
        /// </summary>
        /// <param name="userId">Identificador do usuário que realizou o favoritamento.</param>
        /// <param name="providerId">Identificador do provedor favoritado.</param>
        /// <returns>
        /// Retorna o objeto <see cref="Favorite"/> correspondente, 
        /// ou <c>null</c> se não for encontrado.
        /// </returns>
        public async Task<Favorite> GetFavoriteAsync(string userId, Guid providerId)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ProviderId == providerId);
        }

        /// <summary>
        /// Obtém a lista completa de favoritos de um usuário, incluindo os dados do provedor e do usuário associado.
        /// </summary>
        /// <param name="userId">Identificador do usuário que possui os favoritos.</param>
        /// <returns>
        /// Retorna uma lista de objetos <see cref="Favorite"/> 
        /// com informações detalhadas sobre cada provedor favoritado.
        /// </returns>
        /// <remarks>
        /// Este método inclui as relações de navegação <c>Provider</c> e <c>User</c> do provedor,
        /// permitindo acesso direto aos dados do prestador favoritado e seu usuário.
        /// </remarks>
        public async Task<List<Favorite>> GetFavoritesByUserId(string userId)
        {
            return await _context.Favorites
                .Include(f => f.Provider)
                    .ThenInclude(p => p.User) // Inclui o usuário vinculado ao provedor
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }
    }
}
