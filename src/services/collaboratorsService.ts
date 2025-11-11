import { Collaborator, ApiResponse, CreateCollaboratorRequest, UpdateCollaboratorRequest } from '../types';
import apiClient from './api';

export const collaboratorsService = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 10,
    search: string = '', // Valor de búsqueda
    filter: string = ''  // Campo por el cual filtrar
  ): Promise<ApiResponse<Collaborator>> => {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      // Agregar filtro si está especificado
      if (filter && filter.trim()) {
        params.append('filter', filter);
      }

      // Agregar search si está especificado
      if (search && search.trim()) {
        params.append('search', search);
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

  create: async (collaborator: CreateCollaboratorRequest): Promise<Collaborator> => {
    try {
      const response = await apiClient.post<Collaborator>('/collaborators', collaborator);
      return response.data;
    } catch (error) {
      console.error('Error creating collaborator:', error);
      throw new Error('Failed to create collaborator');
    }
  },

  update: async (id: string, collaborator: UpdateCollaboratorRequest): Promise<Collaborator> => {
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