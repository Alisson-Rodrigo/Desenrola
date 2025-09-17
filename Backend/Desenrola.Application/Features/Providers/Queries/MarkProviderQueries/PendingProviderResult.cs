using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Queries.MarkProviderQueries
{
    public class PendingProviderResult
    {
        public Guid Id { get; set; }
        public string CPF { get; set; } = string.Empty;
        public string RG { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }

        // Construtor que mapeia a entidade para o DTO
        public PendingProviderResult(Provider provider)
        {
            Id = provider.Id;
            CPF = provider.CPF;
            RG = provider.RG;
            Address = provider.Address;
            PhoneNumber = provider.PhoneNumber;
            IsActive = provider.IsActive;
            IsVerified = provider.IsVerified;
        }
    }
}
