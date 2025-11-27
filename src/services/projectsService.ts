import apiClient from './api';
import { Project, ApiResponse } from '../types';

export const projectsService = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 20,
    search: string = '',
    filter: string = ''
  ): Promise<ApiResponse<Project>> => {
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

      const response = await apiClient.get<ApiResponse<Project>>(`/projects?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  },

  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },
};
