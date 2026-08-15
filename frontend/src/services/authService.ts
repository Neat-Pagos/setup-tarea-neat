import { api } from './api';

export interface AuthUser { uid: string; email: string | null }

export const authService = {
  async login(email: string, password: string): Promise<void> {
    await api.post('/auth/login', { email, password });
  },
  async getSession(): Promise<AuthUser> {
    const response = await api.get<AuthUser>('/auth/session');
    return response.data;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
