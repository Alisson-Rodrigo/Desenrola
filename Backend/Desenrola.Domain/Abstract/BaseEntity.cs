using System.ComponentModel.DataAnnotations;

namespace Desenrola.Domain.Abstract;
public abstract class BaseEntity {

    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedOn { get; set; } = DateTime.UtcNow;

    protected BaseEntity() { }
}
