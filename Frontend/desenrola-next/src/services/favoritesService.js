const BASE_URL = 'http://localhost:5087';
const token = () => localStorage.getItem('auth_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token()}`
});

export const FavoritesService = {
  async getAll() {
    const res = await fetch(`${BASE_URL}/api/favorites`, {
      method: 'GET',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Erro ao buscar favoritos');
    return res.json(); // [{ providerId }]
  },

  async add(providerId) {
    const res = await fetch(`${BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ providerId })
    });
    if (!res.ok) throw new Error('Erro ao adicionar favorito');
  },

  async remove(providerId) {
    const res = await fetch(`${BASE_URL}/api/favorites`, {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ providerId })
    });
    if (!res.ok) throw new Error('Erro ao remover favorito');
  },

  async getProvider(providerId) {
    const res = await fetch(`${BASE_URL}/api/provider/profile/specify?providerId=${providerId}`, {
      method: 'GET',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Erro ao buscar dados do prestador');
    return res.json();
  }
};
