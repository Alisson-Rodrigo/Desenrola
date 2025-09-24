using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Evaluation.Command.CreatedEvaluationCommand
{
    public class CreatedEvaluationCommand : IRequest<Unit>
    {
        public Guid ProviderId { get; set; }   // prestador que será avaliado
        public int Note { get; set; }          // 1 a 5
        public string? Comment { get; set; }   // comentário opcional
    }
}
