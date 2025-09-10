namespace Desenrola.Domain.Entities
{
    public class Provider
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public virtual User User { get; set; } = null!;
    }
}
