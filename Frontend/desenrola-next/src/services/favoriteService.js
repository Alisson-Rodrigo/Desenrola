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
        throw new Error('Erro ao buscar favoritos');
      }

      const data = await res.json();
      console.log("Resposta recebida de favoritos:", data); // Depuração

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
  }
};
