using Desenrola.Domain.Abstract;
using Desenrola.Domain.Enums;

namespace Desenrola.Domain.Entities
{
    public class Provider : BaseEntity
    {
        // FK para User
        public required string UserId { get; set; }

        // Dados de identidade e segurança
        public required string CPF { get; set; }
        public required string RG { get; set; }
        public required List<string> DocumentPhotoUrl { get; set; } // link/arquivo armazenado
        public required string Address { get; set; }


        // Dados profissionais
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public required List<ServiceCategory> Categories { get; set; }

        // Status
        public bool IsActive { get; set; } = true;
        public bool IsVerified { get; set; } = false; // verificação de documentos

        public virtual List<ProviderService> Services { get; set; } = new();

        // Navegaçãoacc
        public virtual User User { get; set; } = null!;
    }
}
