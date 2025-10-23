using Desenrola.Application.Contracts.Persistance.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Persistence.Repositories
{
    /// <summary>
    /// Implementação do padrão Unit of Work.
    /// Responsável por coordenar as operações de repositórios e garantir que todas as alterações
    /// realizadas em uma transação sejam salvas de forma consistente no banco de dados.
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DefaultContext _context;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="UnitOfWork"/>.
        /// </summary>
        /// <param name="context">Contexto do banco de dados utilizado para persistência.</param>
        public UnitOfWork(DefaultContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Confirma todas as alterações realizadas nas entidades rastreadas pelo contexto,
        /// persistindo-as no banco de dados de forma assíncrona.
        /// </summary>
        /// <returns>
        /// Uma <see cref="Task"/> representando a operação assíncrona de salvamento das alterações.
        /// </returns>
        public async Task Commit()
        {
            await _context.SaveChangesAsync();
        }
    }
}
