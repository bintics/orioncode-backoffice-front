import apiClient from './api';
import { Collaborator } from '../types';

export const collaboratorsService = {
  getAll: async (): Promise<Collaborator[]> => {
    const response = await apiClient.get<Collaborator[]>('/collaborators');
    return response.data;
  },

  getById: async (id: string): Promise<Collaborator> => {
    const response = await apiClient.get<Collaborator>(`/collaborators/${id}`);
    return response.data;
  },

  create: async (collaborator: Collaborator): Promise<Collaborator> => {
    const response = await apiClient.post<Collaborator>('/collaborators', collaborator);
    return response.data;
  },

  update: async (id: string, collaborator: Collaborator): Promise<Collaborator> => {
    const response = await apiClient.put<Collaborator>(`/collaborators/${id}`, collaborator);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/collaborators/${id}`);
  },
};
