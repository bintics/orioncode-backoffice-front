import apiClient from './api';
import { Position, PositionsResponse } from '../types';

export const positionsService = {
  getAll: async (page: number = 1, pageSize: number = 10): Promise<PositionsResponse> => {
    const response = await apiClient.get<PositionsResponse>('/positions', {
      params: { page, pageSize }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Position> => {
    const response = await apiClient.get<Position>(`/positions/${id}`);
    return response.data;
  },

  create: async (position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Promise<Position> => {
    const response = await apiClient.post<Position>('/positions', position);
    return response.data;
  },

  update: async (id: string, position: Partial<Position>): Promise<Position> => {
    const response = await apiClient.put<Position>(`/positions/${id}`, position);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/positions/${id}`);
  },
};
