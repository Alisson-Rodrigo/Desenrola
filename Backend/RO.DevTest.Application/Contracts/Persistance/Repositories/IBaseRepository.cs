using System.Linq.Expressions;

namespace RO.DevTest.Application.Contracts.Persistance.Repositories;

public interface IBaseRepository<T> where T : class {

    /// <summary>
    /// Creates a new entity in the database
    /// </summary>
    /// <param name="entity"> The entity to be create </param>
    /// <param name="cancellationToken"> Cancellation token </param>
    /// <returns> The created entity </returns>
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Finds the first entity that matches with the <paramref name="predicate"/>
    /// </summary>
    /// <param name="predicate">
    /// The <see cref="Expression"/> to be used while
    /// looking for the entity
    /// </param>
    /// <returns>
    /// The <typeparamref name="T"/> entity, if found. Null otherwise. </returns>
    T? Get(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes);

    /// <summary>
    /// Updates an entity entry on the database
    /// </summary>
    /// <param name="entity"> The entity to be added </param>
    void Update(T entity);

    /// <summary>
    /// Deletes one entry from the database
    /// </summary>
    /// <param name="entity"> The entity to be deleted </param>
    void Delete(T entity);
}
