import { Collaborator, ApiResponse } from '../types';
import apiClient from './api';

export const collaboratorsService = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 10,
    _search: string = '', // Mantenido para compatibilidad con la interfaz
    filter: string = ''
  ): Promise<ApiResponse<Collaborator>> => {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      // Agregar parámetros opcionales solo si tienen valor
      if (filter && filter.includes(':')) {
        const [field, value] = filter.split(':');
        // Solo enviar el filtro si tanto el campo como el valor tienen contenido
        if (field && value && value.trim()) {
          params.append('filter', filter);
        }
      }

      // Hacer la llamada real al API
      const response = await apiClient.get<ApiResponse<Collaborator>>(`/collaborators?${params}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      throw new Error('Failed to fetch collaborators');
    }
  },

  getById: async (id: string): Promise<Collaborator> => {
    try {
      const response = await apiClient.get<Collaborator>(`/collaborators/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborator:', error);
      throw new Error('Failed to fetch collaborator');
    }
  },

  create: async (collaborator: Omit<Collaborator, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaborator> => {
    try {
      const response = await apiClient.post<Collaborator>('/collaborators', collaborator);
      return response.data;
    } catch (error) {
      console.error('Error creating collaborator:', error);
      throw new Error('Failed to create collaborator');
    }
  },

  update: async (id: string, collaborator: Partial<Collaborator>): Promise<Collaborator> => {
    try {
      const response = await apiClient.put<Collaborator>(`/collaborators/${id}`, collaborator);
      return response.data;
    } catch (error) {
      console.error('Error updating collaborator:', error);
      throw new Error('Failed to update collaborator');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/collaborators/${id}`);
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      throw new Error('Failed to delete collaborator');
    }
  },
};