import apiClient from './api';
import { Team, ApiResponse, CreateTeamRequest, UpdateTeamRequest } from '../types';

export const teamsService = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 10,
    search: string = '',
    filter: string = ''
  ): Promise<ApiResponse<Team>> => {
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

      const response = await apiClient.get<ApiResponse<Team>>(`/teams?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams');
    }
  },

  // Función específica para obtener equipos para dropdowns
  getAllForDropdown: async (): Promise<Team[]> => {
    try {
      const response = await apiClient.get<Team[]>('/teams', {
        headers: {
          'X-dropdown': 'true'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch teams for dropdown');
    }
  },

  getById: async (id: string): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (team: CreateTeamRequest): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', team);
    return response.data;
  },

  update: async (id: string, team: UpdateTeamRequest): Promise<Team> => {
    const response = await apiClient.put<Team>(`/teams/${id}`, team);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },
};
