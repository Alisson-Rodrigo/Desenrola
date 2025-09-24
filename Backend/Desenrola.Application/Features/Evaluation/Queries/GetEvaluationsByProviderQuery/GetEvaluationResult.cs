using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Evaluation.Queries.GetEvaluationsByProviderQuery
{
    public class GetEvaluationResult
    {
        public Guid Id { get; set; }
        public int Note { get; set; }
        public string? Comment { get; set; }

        // Dados do avaliador
        public string UserName { get; set; } = string.Empty;
        public string? UserImage { get; set; }
    }
}
