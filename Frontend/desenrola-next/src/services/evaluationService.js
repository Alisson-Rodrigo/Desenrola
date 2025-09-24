import { authPost, authGet } from './http';

export const EvaluationService = {
  async createEvaluation({ providerId, rating, comment }) {
    const formData = new FormData();
    formData.append('ProviderId', providerId); // 👈 maiúsculo
    formData.append('Note', rating.toString()); // 👈 int em string
    formData.append('Comment', comment);

    return authPost('/api/evaluation', formData);
  },

  async getPendingEvaluations() {
    return authGet('/api/evaluation/pending'); 
  }
};
