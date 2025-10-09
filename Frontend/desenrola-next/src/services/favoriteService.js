const BASE_URL = 'http://localhost:5087';
const token = () => localStorage.getItem('auth_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token()}`
});

export const FavoritesService = {
  // Buscar todos os favoritos
  async getAll() {
    try {
      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: 'GET',
        headers: authHeaders()
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("❌ Erro ao buscar favoritos:", err);
        throw new Error('Erro ao buscar favoritos');
      }

      const data = await res.json();
      console.log("Resposta recebida:", data); // Adicionado para depuração

      // Verifica se a resposta contém a propriedade 'providers' e se é um array válido
      if (data && Array.isArray(data.providers)) {
        return data.providers; // [{ id, name, serviceName }]
      } else {
        console.error("A resposta de favoritos não contém 'providers' ou não é um array:", data);
        throw new Error('A resposta de favoritos não contém \'providers\' ou não é um array');
      }
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
      throw new Error('Erro ao buscar favoritos');
    }
  },

  // Adicionar um novo favorito
  async add(providerId) {
    try {
      // Verificar se o prestador já foi favoritado
      const allFavorites = await this.getAll();

      // Verifica se o providerId já está na lista de favoritos
      const isFavorited = allFavorites.some(fav => fav.id === providerId);

      if (isFavorited) {
        console.log("O prestador já foi favoritado");
        return; // Não faz nada se já estiver favoritado
      }

      // Adiciona o prestador aos favoritos
      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ providerId })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("❌ Erro ao adicionar favorito:", err);
        throw new Error('Erro ao adicionar favorito');
      }

      console.log("✔️ Favoritado com sucesso");
    } catch (err) {
      console.error("Erro ao verificar ou adicionar favorito:", err);
      throw new Error('Erro ao verificar ou adicionar favorito');
    }
  },

  // Remover um favorito
  async remove(providerId) {
    try {
      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ providerId })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("❌ Erro ao remover favorito:", err);
        throw new Error('Erro ao remover favorito');
      }

      console.log("✔️ Favorito removido com sucesso");
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      throw new Error('Erro ao remover favorito');
    }
  },

  // Buscar dados do prestador
  async getProvider(providerId) {
    try {
      const res = await fetch(`${BASE_URL}/api/provider/profile/specify?providerId=${providerId}`, {
        method: 'GET',
        headers: authHeaders()
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("❌ Erro ao buscar dados do prestador:", err);
        throw new Error('Erro ao buscar dados do prestador');
      }

      return res.json();
    } catch (err) {
      console.error("Erro ao buscar dados do prestador:", err);
      throw new Error('Erro ao buscar dados do prestador');
    }
  }
};
