using System.ComponentModel;

namespace Desenrola.Domain.Enums
{
    public enum ServiceCategory
    {
        [Description("Elétrica")]
        Eletrica = 0,

        [Description("Hidráulica")]
        Hidraulica = 1,

        [Description("Pintura")]
        Pintura = 2,

        [Description("Jardinagem")]
        Jardinagem = 3,

        [Description("Limpeza")]
        Limpeza = 4,

        [Description("Reformas e Construção")]
        Reformas = 5,

        [Description("Tecnologia da Informação (TI)")]
        TI = 6,

        [Description("Transporte e Mudanças")]
        Transporte = 7,

        [Description("Beleza e Estética")]
        Beleza = 8,

        [Description("Educação e Aulas Particulares")]
        Educacao = 9,

        [Description("Saúde e Bem-estar")]
        Saude = 10,

        [Description("Serviços Automotivos")]
        Automotivo = 11,

        [Description("Marcenaria e Móveis Planejados")]
        Marcenaria = 12,

        [Description("Serralheria")]
        Serralheria = 13,

        [Description("Climatização (Ar-condicionado e Ventilação)")]
        Climatizacao = 14,

        [Description("Instalação de Eletrodomésticos")]
        InstalacaoEletrodomesticos = 15,

        [Description("Fotografia e Filmagem")]
        Fotografia = 16,

        [Description("Eventos e Festas")]
        Eventos = 17,

        [Description("Consultoria Financeira e Contábil")]
        ConsultoriaFinanceira = 18,

        [Description("Assistência Técnica (Eletrônicos)")]
        AssistenciaTecnica = 19,

        [Description("Design e Publicidade")]
        DesignPublicidade = 20,

        [Description("Serviços Jurídicos")]
        Juridico = 21,

        [Description("Segurança (Câmeras, Alarmes, Portões)")]
        Seguranca = 22,

        [Description("Marketing Digital e Social Media")]
        MarketingDigital = 23,

        [Description("Consultoria Empresarial")]
        ConsultoriaEmpresarial = 24,

        [Description("Tradução e Idiomas")]
        TraducaoIdiomas = 25,

        [Description("Serviços Domésticos Gerais")]
        ServicosDomesticos = 26,

        [Description("Manutenção Predial e Industrial")]
        ManutencaoPredial = 27,

        [Description("Pet Care (Banho, Tosa e Passeio)")]
        PetCare = 28,

        [Description("Culinária e Gastronomia")]
        Gastronomia = 29
    }
}
