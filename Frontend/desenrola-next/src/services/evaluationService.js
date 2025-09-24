import { http } from './http';

export const EvaluationService = {
  async getByProviderId(providerId) {
    const response = await http.get(`/evaluations/provider/${providerId}`);
    return response.data;
  },

  async createEvaluation(data) {
    const response = await http.post('/evaluations', data);
    return response.data;
  }
};
