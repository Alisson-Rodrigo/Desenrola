using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand;
using Desenrola.Domain.Entities;
using Stripe.Checkout;
using Stripe;

namespace Desenrola.Application.Services
{
    public class StripeService : IStripeService
    {
        private readonly string _priceMaster;
        private readonly string _priceVip;
        private readonly string _successUrl;
        private readonly string _cancelUrl;

        public StripeService()
        {
            // ✅ Configuração da API Key do Stripe via variável de ambiente
            StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_API_KEY");

            if (string.IsNullOrEmpty(StripeConfiguration.ApiKey))
                throw new InvalidOperationException("Variável STRIPE_API_KEY não configurada.");

            // ✅ IDs de preços (definidos no dashboard do Stripe)
            _priceMaster = Environment.GetEnvironmentVariable("STRIPE_PRICE_MASTER") ?? string.Empty;
            _priceVip = Environment.GetEnvironmentVariable("STRIPE_PRICE_VIP") ?? string.Empty;

            // ✅ URLs de sucesso e cancelamento (pode vir do .env)
            _successUrl = Environment.GetEnvironmentVariable("STRIPE_SUCCESS_URL") ?? "https://app.desenrola.com/success";
            _cancelUrl = Environment.GetEnvironmentVariable("STRIPE_CANCEL_URL") ?? "https://app.desenrola.com/cancel";

            if (string.IsNullOrEmpty(_priceMaster) || string.IsNullOrEmpty(_priceVip))
                throw new InvalidOperationException("IDs de preço não configurados (STRIPE_PRICE_MASTER/VIP).");
        }

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
