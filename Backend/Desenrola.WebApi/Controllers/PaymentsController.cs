using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand;
using Desenrola.Domain.Entities;
using Desenrola.Persistence.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace Desenrola.WebApi.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PaymentsController> _logger;
        private readonly string _webhookSecret;

        public PaymentsController(
            IMediator mediator,
            IPaymentRepository paymentRepository,
            ILogger<PaymentsController> logger,
            IUnitOfWork unitOfWork)
        {
            _mediator = mediator;
            _paymentRepository = paymentRepository;
            _logger = logger;

            _webhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET")
                ?? throw new Exception("STRIPE_WEBHOOK_SECRET não configurado.");
            _unitOfWork = unitOfWork;
        }

        // ============================================================
        // 🔹 1) Iniciar o checkout do Stripe via MediatR
        // ============================================================
        [Authorize]
        [HttpPost("checkout/{planId:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePayment([FromRoute] int planId)
        {
            var command = new PlanPaymentCommand { PlanId = planId };
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        // ============================================================
        // 🔹 2) Receber Webhook do Stripe (atualização de status)
        // ============================================================
        [HttpPost("stripe-webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            _logger.LogInformation($"Evento Stripe recebido: {json}");

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _webhookSecret);

                _logger.LogInformation($"Evento Stripe processado: {stripeEvent.Type}");

                switch (stripeEvent.Type)
                {
                    // ✅ Pagamento concluído
                    case "checkout.session.completed":
                        {
                            var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                            var payment = await _paymentRepository.GetBySessionIdAsync(session!.Id);

                            if (payment != null)
                            {
                                payment.Status = PaymentStatus.Completed;
                                payment.PaymentIntentId = session.PaymentIntentId ?? payment.PaymentIntentId;
                                payment.StripeInvoiceUrl = session.Url;

                                _paymentRepository.Update(payment);
                            }
                            else
                            {
                                _logger.LogWarning($"Pagamento não encontrado para sessão: {session.Id}");
                            }
                            break;
                        }

                    // ⚠️ Sessão expirada
                    case "checkout.session.expired":
                        {
                            var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                            var payment = await _paymentRepository.GetBySessionIdAsync(session!.Id);

                            if (payment != null)
                            {
                                payment.Status = PaymentStatus.Expired;
                                _paymentRepository.Update(payment);
                            }
                            break;
                        }

                    // ❌ Pagamento falhou
                    case "payment_intent.payment_failed":
                        {
                            var intent = stripeEvent.Data.Object as PaymentIntent;
                            var payment = await _paymentRepository.GetByPaymentIntentIdAsync(intent!.Id);

                            if (payment != null)
                            {
                                payment.Status = PaymentStatus.Failed;
                                _paymentRepository.Update(payment);
                            }
                            break;
                        }

                    default:
                        _logger.LogInformation($"Evento não tratado: {stripeEvent.Type}");
                        break;
                }

                await _unitOfWork.Commit();
                return Ok();
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Erro no processamento do webhook do Stripe");
                return BadRequest();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro interno ao processar webhook");
                return StatusCode(500);
            }
        }
    }
}
