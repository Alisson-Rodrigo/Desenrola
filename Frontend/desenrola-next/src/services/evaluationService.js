import { authPost, authGet } from './http';



/**
 * Cria uma nova avaliação para um prestador de serviço.
 * Envia os dados via formulário com ID do prestador, nota e comentário.
 * @param {Object} params Parâmetros da avaliação
 * @param {string} params.providerId ID do prestador avaliado
 * @param {number} params.rating Nota da avaliação (1 a 5)
 * @param {string} params.comment Comentário textual da avaliação
 * @returns {Promise<Response>} Resposta da API
 */

export const EvaluationService = {
  async createEvaluation({ providerId, rating, comment }) {
    const formData = new FormData();
    formData.append('ProviderId', providerId); // 👈 maiúsculo
    formData.append('Note', rating.toString()); // 👈 int em string
    formData.append('Comment', comment);

    return authPost('/api/evaluation', formData);
  },
/**
 * Busca avaliações pendentes do usuário autenticado.
 * @returns {Promise<Array>} Lista de avaliações pendentes
 */

  async getPendingEvaluations() {
    return authGet('/api/evaluation/pending'); 
  }
};
