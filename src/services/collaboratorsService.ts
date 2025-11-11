import apiClient from './api';
import { Collaborator, CollaboratorsResponse } from '../types';

export const collaboratorsService = {
  getAll: async (page: number = 1, pageSize: number = 10): Promise<CollaboratorsResponse> => {
    const response = await apiClient.get<CollaboratorsResponse>('/collaborators', {
      params: { page, pageSize }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Collaborator> => {
    const response = await apiClient.get<Collaborator>(`/collaborators/${id}`);
    return response.data;
  },

  create: async (collaborator: Omit<Collaborator, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaborator> => {
    const response = await apiClient.post<Collaborator>('/collaborators', collaborator);
    return response.data;
  },

  update: async (id: string, collaborator: Partial<Collaborator>): Promise<Collaborator> => {
    const response = await apiClient.put<Collaborator>(`/collaborators/${id}`, collaborator);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/collaborators/${id}`);
  },
};
