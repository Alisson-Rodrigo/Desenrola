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
    /// <summary>
    /// Controlador responsável pelo gerenciamento de pagamentos via Stripe.
    /// Possui endpoints para iniciar o checkout e receber notificações de eventos (webhooks) do Stripe.
    /// </summary>
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PaymentsController> _logger;
        private readonly string _webhookSecret;

        /// <summary>
        /// Inicializa uma nova instância do controlador de pagamentos.
        /// </summary>
        /// <param name="mediator">Instância do MediatR usada para disparar comandos e consultas.</param>
        /// <param name="paymentRepository">Repositório de pagamentos para persistência de dados relacionados.</param>
        /// <param name="logger">Instância de logger para registrar eventos e erros.</param>
        /// <param name="unitOfWork">Interface para controle de transações e commits na base de dados.</param>
        /// <exception cref="Exception">Lançada quando a variável de ambiente <c>STRIPE_WEBHOOK_SECRET</c> não está configurada.</exception>
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

        /// <summary>
        /// Inicia o processo de pagamento (checkout) de um plano utilizando o Stripe.
        /// </summary>
        /// <param name="planId">Identificador numérico do plano que o usuário deseja adquirir.</param>
        /// <returns>
        /// Retorna um objeto com as informações do checkout (ex: URL de pagamento do Stripe) com <see cref="StatusCodes.Status200OK"/>.
        /// Retorna <see cref="StatusCodes.Status400BadRequest"/> em caso de falha na criação.
        /// </returns>
        /// <remarks>
        /// Este endpoint requer autenticação do usuário e utiliza o MediatR para encaminhar o comando de pagamento.
        /// </remarks>
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

        /// <summary>
        /// Endpoint de Webhook do Stripe utilizado para processar eventos automáticos, como conclusão, expiração ou falha de pagamentos.
        /// </summary>
        /// <returns>
        /// Retorna <see cref="StatusCodes.Status200OK"/> se o evento for processado com sucesso.
        /// Retorna <see cref="StatusCodes.Status400BadRequest"/> se a validação do evento falhar.
        /// Retorna <see cref="StatusCodes.Status500InternalServerError"/> em caso de erro interno.
        /// </returns>
        /// <remarks>
        /// Este endpoint não requer autenticação, pois é chamado diretamente pelos servidores do Stripe.  
        /// Os principais eventos tratados são:
        /// <list type="bullet">
        /// <item><term><c>checkout.session.completed</c></term> → Pagamento concluído com sucesso.</item>
        /// <item><term><c>checkout.session.expired</c></term> → Sessão de pagamento expirada.</item>
        /// <item><term><c>payment_intent.payment_failed</c></term> → Pagamento falhou.</item>
        /// </list>
        /// O evento é validado usando o segredo configurado na variável de ambiente <c>STRIPE_WEBHOOK_SECRET</c>.
        /// </remarks>
        [HttpPost("stripe-webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            _logger.LogInformation($"Evento Stripe recebido: {json}");

            try
            {
                // ⚙️ Construção segura do evento com tolerância e sem erro por versão de API
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _webhookSecret,
                    tolerance: 300,
                    throwOnApiVersionMismatch: false
                );

                _logger.LogInformation($"Evento Stripe processado: {stripeEvent.Type}");

                switch (stripeEvent.Type)
                {
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
