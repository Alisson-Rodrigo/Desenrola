import { authPost, authGet } from './http';

export const EvaluationService = {
  async createEvaluation({ providerId, rating, comment }) {
    const formData = new FormData();
    formData.append('providerId', providerId);
    formData.append('note', rating);
    formData.append('comment', comment);

    return authPost('/api/evaluation', formData); // POST avaliação
  },

  async getPendingEvaluations() {
    return authGet('/api/evaluation/pending'); // Altere aqui conforme sua rota real
  }
};
