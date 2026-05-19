import axios from 'axios';
import { Adoption } from '../types/adoption';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const adoptionsService = {
  async getReviewAdoptions(): Promise<Adoption[]> {
    try {
      const response = await axios.get(`${API_URL}/adoptions/review`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al obtener adopciones para revisión' };
    }
  },

  async approveAdoption(adoptionId: string): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/adoptions/manage/${adoptionId}/approve`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al aprobar adopción' };
    }
  },

  async rejectAdoption(adoptionId: string, reason: string): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/adoptions/manage/${adoptionId}/reject`, {
        rejectionReason: reason
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al rechazar adopción' };
    }
  },

  async markDelivered(adoptionId: string): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/adoptions/delivery/${adoptionId}/delivered`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al marcar adopción como entregada' };
    }
  },

  async markDeliveryFailed(adoptionId: string, deliveryComment: string): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/adoptions/delivery/${adoptionId}/comment`, { deliveryComment });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al registrar fallo de entrega' };
    }
  },

  async markSecurityConcern(adoptionId: string, securityComment: string): Promise<any> {
    try {
      const response = await axios.put(`${API_URL}/adoptions/delivery/${adoptionId}/security-concern`, { securityComment });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Error al marcar preocupación de seguridad' };
    }
  },
};