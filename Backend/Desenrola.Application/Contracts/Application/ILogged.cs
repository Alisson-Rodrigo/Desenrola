using Desenrola.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Application
{
    public interface ILogged
    {
        Task<Domain.Entities.User> UserLogged();
        Task<bool> IsInRole(string role);
    }
}
