import apiClient from './api';
import { Position, ApiResponse, CreatePositionRequest, UpdatePositionRequest } from '../types';

export const positionsService = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 10,
    search: string = '',
    filter: string = ''
  ): Promise<ApiResponse<Position>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (filter && filter.trim()) {
        params.append('filter', filter);
      }

      if (search && search.trim()) {
        params.append('search', search);
      }

      const response = await apiClient.get<ApiResponse<Position>>(`/positions?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw new Error('Failed to fetch positions');
    }
  },

  getById: async (id: string): Promise<Position> => {
    const response = await apiClient.get<Position>(`/positions/${id}`);
    return response.data;
  },

  create: async (position: CreatePositionRequest): Promise<Position> => {
    const response = await apiClient.post<Position>('/positions', position);
    return response.data;
  },

  update: async (id: string, position: UpdatePositionRequest): Promise<Position> => {
    const response = await apiClient.put<Position>(`/positions/${id}`, position);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/positions/${id}`);
  },
};
