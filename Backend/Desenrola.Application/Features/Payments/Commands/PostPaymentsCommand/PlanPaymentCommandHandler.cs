using Desenrola.Application.Contracts.Application;
using Desenrola.Application.Contracts.Persistance.Repositories;
using Desenrola.Domain.Entities;
using Desenrola.Domain.Exception;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Payments.Commands.PostPaymentsCommand
{
    /// <summary>
    /// Handler responsável por processar o pagamento de planos via Stripe.
    /// </summary>
    public class PlanPaymentCommandHandler : IRequestHandler<PlanPaymentCommand, ResponseStripeDTO>
    {
        private readonly ILogged _logged;
        private readonly IStripeService _stripeService;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IUnitOfWork _unitOfWork;

        /// <summary>
        /// Inicializa uma nova instância do <see cref="PlanPaymentCommandHandler"/>.
        /// </summary>
        /// <param name="logged">Serviço responsável por obter o usuário atualmente autenticado.</param>
        /// <param name="stripeService">Serviço que integra com a API do Stripe para criar cobranças.</param>
        /// <param name="paymentRepository">Repositório responsável pelo gerenciamento dos registros de pagamento.</param>
        /// <param name="unitOfWork">Gerenciador de transações que assegura a persistência atômica das operações.</param>

        public PlanPaymentCommandHandler(
            ILogged logged,
            IStripeService stripeService,
            IPaymentRepository paymentRepository,
            IUnitOfWork unitOfWork)
        {
            _logged = logged;
            _stripeService = stripeService;
            _paymentRepository = paymentRepository;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Manipula o comando <see cref="PlanPaymentCommand"/>, processando a compra de um plano.
        /// </summary>
        /// <param name="request">Comando contendo o ID do plano desejado pelo usuário.</param>
        /// <param name="cancellationToken">Token usado para cancelar a operação assíncrona, se necessário.</param>
        /// <returns>Um objeto <see cref="ResponseStripeDTO"/> com os dados da sessão de pagamento criada no Stripe.</returns>
        /// <exception cref="BadRequestException">Lançada quando o plano é inválido, há um plano ativo ou pendente.</exception>
        /// <exception cref="UnauthorizedAccessException">Lançada quando o usuário não está autenticado.</exception>
        /// <exception cref="ArgumentException">Lançada se o tipo de plano for inválido no cálculo de preço.</exception>

        public async Task<ResponseStripeDTO> Handle(PlanPaymentCommand request, CancellationToken cancellationToken)
        {
            // 🔹 1) Validar tipo de plano
            if ((PlanTypeEnum)request.PlanId != PlanTypeEnum.VIP && (PlanTypeEnum)request.PlanId != PlanTypeEnum.Master)
                throw new BadRequestException("Plano inválido.");

            var user = await _logged.UserLogged()
                ?? throw new UnauthorizedAccessException("Usuário não autenticado.");

            var planType = (PlanTypeEnum)request.PlanId;

            // 🔹 2) Verificar plano ativo
            var activePlan = await _paymentRepository.GetActivePlanAsync(user.Id);
            if (activePlan != null)
                throw new BadRequestException("Você já possui um plano ativo.");

            // 🔹 3) Verificar assinatura pendente (aguardando pagamento)
            var pendingPlan = await _paymentRepository.GetPendingPlan(user.Id);
            if (pendingPlan != null)
            {
                var timeElapsed = DateTime.UtcNow - pendingPlan.PurchaseDate;
                if (timeElapsed.TotalMinutes < 10)
                    throw new BadRequestException("Há uma solicitação de plano pendente. Aguarde a confirmação.");

                // Caso tenha passado o limite, remove e libera novo pagamento
                // Faz o Commit separadamente para garantir que não conflite com a operação de pagamento
                _paymentRepository.Delete(pendingPlan);
                await _unitOfWork.Commit();  // Commit após a exclusão
            }

            // 🔹 4) Criar cobrança Stripe
            var stripeResponse = await _stripeService.CreateOneTimePayment(user, planType);

            if (string.IsNullOrEmpty(stripeResponse.PaymentIntentId))
                stripeResponse.PaymentIntentId = Guid.NewGuid().ToString();

            // 🔹 5) Registrar pagamento no sistema
            var newPayment = new Payment
            {
                UserId = user.Id,
                PlanType = planType,
                PaymentIntentId = stripeResponse.PaymentIntentId,
                SessionId = stripeResponse.SessionId,
                StripeInvoiceUrl = stripeResponse.PaymentUrl,
                Amount = GetPlanPrice(planType),
                PurchaseDate = DateTime.UtcNow,
                ExpirationDate = DateTime.UtcNow.AddMonths(1),
                Status = PaymentStatus.Pending
            };

            // Grava o novo pagamento
            await _paymentRepository.CreateAsync(newPayment);
            await _unitOfWork.Commit();  // Commit após o novo pagamento

            return stripeResponse;
        }


        private decimal GetPlanPrice(PlanTypeEnum planType)
        {
            return planType switch
            {
                PlanTypeEnum.VIP => 99.90m,
                PlanTypeEnum.Master => 199.90m,
                _ => throw new ArgumentException("Tipo de plano inválido.")
            };
        }
    }
}
