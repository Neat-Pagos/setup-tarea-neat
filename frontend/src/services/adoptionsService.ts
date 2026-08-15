import { Adoption, UserData } from '../types/adoption';
import { api } from './api';

export const adoptionsService = {
  async createAdoption(pokemonId: string, userData: UserData): Promise<{ message: string; adoptionId: string }> {
    try {
      const response = await api.post('/adoptions/v2', { pokemonId, userData });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al crear la solicitud de adopción' };
    }
  },

  async getReviewAdoptions(): Promise<Adoption[]> {
    try {
      const response = await api.get('/adoptions/review');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al obtener adopciones para revisión' };
    }
  },

  async approveAdoption(adoptionId: string): Promise<any> {
    try {
      const response = await api.put(`/adoptions/manage/${adoptionId}/approve`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al aprobar adopción' };
    }
  },

  async rejectAdoption(adoptionId: string, reason: string): Promise<any> {
    try {
      const response = await api.put(`/adoptions/manage/${adoptionId}/reject`, {
        rejectionReason: reason
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al rechazar adopción' };
    }
  }
};
