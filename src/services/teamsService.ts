import apiClient from './api';
import { Team } from '../types';

export const teamsService = {
  getAll: async (): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>('/teams');
    return response.data;
  },

  getById: async (id: string): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (team: Team): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', team);
    return response.data;
  },

  update: async (id: string, team: Team): Promise<Team> => {
    const response = await apiClient.put<Team>(`/teams/${id}`, team);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },
};
