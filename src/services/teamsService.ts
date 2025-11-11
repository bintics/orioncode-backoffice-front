import apiClient from './api';
import { Team, TeamsResponse } from '../types';

export const teamsService = {
  getAll: async (page: number = 1, pageSize: number = 10): Promise<TeamsResponse> => {
    const response = await apiClient.get<TeamsResponse>('/teams', {
      params: { page, pageSize }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', team);
    return response.data;
  },

  update: async (id: string, team: Partial<Team>): Promise<Team> => {
    const response = await apiClient.put<Team>(`/teams/${id}`, team);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },
};
