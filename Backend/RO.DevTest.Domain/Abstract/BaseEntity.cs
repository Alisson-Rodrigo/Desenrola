namespace RO.DevTest.Domain.Abstract;
public abstract class BaseEntity {
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedOn { get; set; } = DateTime.UtcNow;

    protected BaseEntity() { }
}
