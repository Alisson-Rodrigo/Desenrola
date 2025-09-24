using Desenrola.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Providers.Queries.GetProviderProfileQueries
{
    public class GetProviderProfileResponse
    {
        public string Id { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CPF {  get; set; } = string.Empty;
        public string Email {  get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string RG { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public List<string> DocumentPhotoUrl { get; set; } = new List<string>();
        public List<ServiceCategory> Categories { get; set; } = new List<ServiceCategory> { };
    }
}
