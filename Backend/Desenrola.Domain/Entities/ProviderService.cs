using Desenrola.Domain.Abstract;
using Desenrola.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Desenrola.Domain.Entities
{
    public class ProviderService : BaseEntity
    {

        // FK para Provider
        public Guid ProviderId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        // Preço opcional
        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; }

        // Categoria obrigatória, baseada no enum
        public ServiceCategory Category { get; set; }

        //Image Service
        public List<string>? ImageUrls { get; set; } 

        // Status: ativo ou inativo
        public bool IsActive { get; set; } = true;

        // Disponibilidade momentânea (se pode atender agora)
        public bool IsAvailable { get; set; } = true;


        // Navegação
        public virtual Provider Provider { get; set; } = null!;
    }
}
