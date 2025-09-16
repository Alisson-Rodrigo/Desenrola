using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Contracts.Application
{
    public interface ICPF
    {
        public bool IsValidCPF(string cpf);
    }
}
