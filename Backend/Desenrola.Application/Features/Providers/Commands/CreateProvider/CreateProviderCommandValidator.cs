using Desenrola.Application.Contracts.Application;
using FluentValidation;

namespace Desenrola.Application.Features.Providers.Commands.CreateProvider
{
    public class CreateProviderCommandValidator : AbstractValidator<CreateProviderCommand>
    {

        private readonly ICPF _cpfValidator;

        public CreateProviderCommandValidator(ICPF cpfValidator)
        {
            _cpfValidator = cpfValidator;

            RuleFor(x => x.CPF)
                .NotEmpty().WithMessage("O CPF é obrigatório.")
                .Length(11).WithMessage("O CPF deve ter 11 dígitos.")
                .Must(cpf => _cpfValidator.IsValidCPF(cpf))
                .Matches(@"^\d{11}$").WithMessage("O CPF deve conter apenas números.");

            RuleFor(x => x.RG)
                .NotEmpty().WithMessage("O RG é obrigatório.")
                .MaximumLength(20).WithMessage("O RG deve ter no máximo 20 caracteres.");

            RuleFor(x => x.DocumentPhotoUrl)
                .NotEmpty().WithMessage("A foto do documento é obrigatória.")
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.RelativeOrAbsolute))
                .WithMessage("A URL da foto do documento não é válida.");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("O endereço é obrigatório.");

            RuleFor(x => x.ServiceName)
                .NotEmpty().WithMessage("O nome do serviço é obrigatório.")
                .MaximumLength(100).WithMessage("O nome do serviço deve ter no máximo 100 caracteres.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("A descrição é obrigatória.")
                .MaximumLength(500).WithMessage("A descrição deve ter no máximo 500 caracteres.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("O telefone é obrigatório.")
                .Matches(@"^\+?\d{10,15}$").WithMessage("O telefone deve ter entre 10 e 15 dígitos.");
        }
    }
}
