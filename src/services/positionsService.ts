import apiClient from './api';
import { Position } from '../types';

export const positionsService = {
  getAll: async (): Promise<Position[]> => {
    const response = await apiClient.get<Position[]>('/positions');
    return response.data;
  },

  getById: async (id: string): Promise<Position> => {
    const response = await apiClient.get<Position>(`/positions/${id}`);
    return response.data;
  },

  create: async (position: Position): Promise<Position> => {
    const response = await apiClient.post<Position>('/positions', position);
    return response.data;
  },

  update: async (id: string, position: Position): Promise<Position> => {
    const response = await apiClient.put<Position>(`/positions/${id}`, position);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/positions/${id}`);
  },
};
