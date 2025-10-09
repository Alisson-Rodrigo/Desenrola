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
        headers: authHeaders(),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("❌ Erro ao buscar favoritos:", err);
        // Retorna um array vazio em caso de erro para não interromper o fluxo
        return [];
      }

      const data = await res.json();
      console.log("Resposta recebida de favoritos:", data); // Depuração

      // Verifica se a resposta contém 'providers' e se é um array válido
      if (data && Array.isArray(data.providers)) {
        return data.providers; // [{ id, name, serviceName }]
      } else {
        // Caso não haja favoritos, retorna um array vazio
        return []; // Retorna um array vazio se não houver favoritos
      }
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
      // Retorna um array vazio em caso de erro, para não interromper o fluxo
      return [];
    }
  },

  // Verificar se o prestador já foi favoritado
  async isFavorited(providerId) {
    const favorites = await this.getAll();
    return favorites.some(fav => fav.id === providerId);  // Verifica se o prestador está nos favoritos
  },

  // Remover um favorito
  async remove(providerId) {
    try {
      const isFavorited = await this.isFavorited(providerId);

      if (!isFavorited) {
        console.log("✔️ Prestador já removido dos favoritos.");
        return;  // Não faz nada se o prestador não estiver nos favoritos
      }

      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ providerId }), // Envia o providerId no corpo da requisição
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

  // Adicionar um novo favorito
  async add(providerId) {
    try {
      const isFavorited = await this.isFavorited(providerId);

      if (isFavorited) {
        console.log("O prestador já foi favoritado");
        return; // Não faz nada se já estiver favoritado
      }

      const res = await fetch(`${BASE_URL}/api/favorites`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ providerId })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Erro ao adicionar favorito:", err);
        throw new Error('Erro ao adicionar favorito');
      }

      console.log("✔️ Favoritado com sucesso");
    } catch (err) {
      console.error("Erro ao verificar ou adicionar favorito:", err);
      throw new Error('Erro ao verificar ou adicionar favorito');
    }
  }
};
