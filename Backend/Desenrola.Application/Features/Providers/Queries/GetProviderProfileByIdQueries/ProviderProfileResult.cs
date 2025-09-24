using Desenrola.Domain.Entities;
using Desenrola.Domain.Enums;


namespace Desenrola.Application.Features.Providers.Queries.GetProviderProfileByIdQueries
{
    public class ProviderProfileResult
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public string RG { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public List<ServiceCategory> Categories { get; set; } = new();
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public List<ServiceSummary> Services { get; set; } = new();

        public ProviderProfileResult(Provider provider)
        {
            Id = provider.Id;
            UserName = provider.ServiceName;
            CPF = provider.CPF;
            RG = provider.RG;
            Address = provider.Address;
            PhoneNumber = provider.PhoneNumber;
            Categories = provider.Categories;
            Description = provider.Description;
            IsActive = provider.IsActive;
            IsVerified = provider.IsVerified;
            Services = provider.Services.Select(s => new ServiceSummary(s)).ToList();
        }
    }

    public class ServiceSummary
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        public ServiceSummary(ProviderService service)
        {
            Id = service.Id;
            Title = service.Title;
            Price = service.Price;
            Category = service.Category.ToString();
            IsActive = service.IsActive;
        }
    }
}
