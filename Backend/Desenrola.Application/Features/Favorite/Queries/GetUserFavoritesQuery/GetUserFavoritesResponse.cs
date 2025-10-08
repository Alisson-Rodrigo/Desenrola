using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desenrola.Application.Features.Favorite.Queries.GetUserFavoritesQuery
{
    public class GetUserFavoritesResponse
    {
        public List<ProviderDto> Providers { get; set; }
    }

    public class ProviderDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ServiceName { get; set; }
        // Adicione outros dados relevantes do provedor aqui
    }
}
