using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Auth.Commands.UpdatePasswordCommand
{
    public class UpdatePasswordCommand : IRequest<Unit>
    {
        public string Email { get; set; } = string.Empty;
    }
}
