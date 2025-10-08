using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.ServicesProviders.Queries.PagedRequestProviderServices
{
    public class ProviderServiceResult
    {
        public Guid Id { get; set; }
        public Guid ProviderId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ProviderName {  get; set; } = string.Empty;

        public string UserId { get; set; }

        public DateTime DateTime { get; set; }
        public decimal? Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public List<string>? Images { get; set; }
        public bool IsActive { get; set; }
        public bool IsAvailable { get; set; }

        public ProviderServiceResult(ProviderService service)
        {
            Id = service.Id;
            ProviderId = service.ProviderId;
            Title = service.Title;
            DateTime = service.CreatedOn;
            Description = service.Description;
            UserId = service.Provider.UserId;
            Price = service.Price;
            ProviderName = service.Provider.ServiceName;
            Category = service.Category.ToString();
            Images = service.ImageUrls;
            IsActive = service.IsActive;
            IsAvailable = service.IsAvailable;
        }
    }
}
