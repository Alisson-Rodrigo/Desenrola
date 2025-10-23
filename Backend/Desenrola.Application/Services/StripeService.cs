using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand;
using Desenrola.Domain.Entities;
using Stripe.Checkout;
using Stripe;

namespace Desenrola.Application.Services
{
    /// <summary>
    /// Serviço responsável pela integração com o Stripe para processar pagamentos únicos (checkout).
    /// </summary>
    public class StripeService : IStripeService
    {
        private readonly string _priceMaster;
        private readonly string _priceVip;
        private readonly string _successUrl;
        private readonly string _cancelUrl;

        /// <summary>
        /// Construtor do serviço do Stripe. 
        /// Inicializa as configurações da API e recupera variáveis de ambiente necessárias para o funcionamento do pagamento.
        /// </summary>
        /// <exception cref="InvalidOperationException">
        /// Lançada caso a chave da API ou os IDs de preço não estejam configurados nas variáveis de ambiente.
        /// </exception>
        public StripeService()
        {
            // ✅ Configuração da API Key do Stripe via variável de ambiente
            StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_API_KEY");

            if (string.IsNullOrEmpty(StripeConfiguration.ApiKey))
                throw new InvalidOperationException("Variável STRIPE_API_KEY não configurada.");

            // ✅ IDs de preços (definidos no dashboard do Stripe)
            _priceMaster = Environment.GetEnvironmentVariable("STRIPE_PRICE_MASTER") ?? string.Empty;
            _priceVip = Environment.GetEnvironmentVariable("STRIPE_PRICE_VIP") ?? string.Empty;

            // ✅ URLs de sucesso e cancelamento
            _successUrl = Environment.GetEnvironmentVariable("STRIPE_SUCCESS_URL") 
                          ?? "https://desenrola.shop/concluirpagamento";

            _cancelUrl = Environment.GetEnvironmentVariable("STRIPE_CANCEL_URL") 
                         ?? "https://desenrola.shop/cancel";

            if (string.IsNullOrEmpty(_priceMaster) || string.IsNullOrEmpty(_priceVip))
                throw new InvalidOperationException("IDs de preço não configurados (STRIPE_PRICE_MASTER/VIP).");
        }

        /// <summary>
        /// Cria uma sessão de pagamento único (checkout) no Stripe para um usuário específico e tipo de plano.
        /// </summary>
        /// <param name="user">Usuário que realizará o pagamento.</param>
        /// <param name="planType">Tipo de plano a ser adquirido (VIP ou Master).</param>
        /// <returns>Um objeto <see cref="ResponseStripeDTO"/> contendo a URL do pagamento e os detalhes da sessão.</returns>
        /// <exception cref="ArgumentException">Lançada caso o tipo de plano seja inválido.</exception>
        public async Task<ResponseStripeDTO> CreateOneTimePayment(User user, PlanTypeEnum planType)
        {
            var sessionOptions = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = GetPriceId(planType),
                        Quantity = 1,
                    }
                },
                Mode = "payment", // 💳 pagamento único
                SuccessUrl = $"{_successUrl}?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = _cancelUrl,
                CustomerEmail = user.Email,
                Metadata = new Dictionary<string, string>
                {
                    { "user_id", user.Id.ToString() },
                    { "plan_type", planType.ToString() }
                }
            };

            var service = new SessionService();
            var session = await service.CreateAsync(sessionOptions);

            return new ResponseStripeDTO
            {
                SessionId = session.Id,
                PaymentUrl = session.Url,
                PaymentIntentId = session.PaymentIntentId ?? string.Empty,
                ExpirationDate = session.ExpiresAt
            };
        }

        /// <summary>
        /// Obtém o ID de preço correto com base no tipo de plano informado.
        /// </summary>
        private string GetPriceId(PlanTypeEnum planType)
        {
            return planType switch
            {
                PlanTypeEnum.VIP => _priceVip,
                PlanTypeEnum.Master => _priceMaster,
                _ => throw new ArgumentException("Tipo de plano inválido.")
            };
        }
    }
}
