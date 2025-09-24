export const EvaluationService = {
  async createEvaluation({ providerId, rating, comment }) {
    const formData = new FormData();
    formData.append('providerId', providerId);
    formData.append('note', rating);
    formData.append('comment', comment);

    return authPost('/api/evaluation', formData, true); // true para indicar que é FormData
  },
};
