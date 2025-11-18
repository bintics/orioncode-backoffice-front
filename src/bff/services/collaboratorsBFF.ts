import bffApiClient from './bffApi';
import { CollaboratorBFFResponse, CollaboratorListBFFResponse, CollaboratorBFFRequest } from '../types/bff';
import { Collaborator } from '../../types';

/**
 * BFF Service for Collaborators
 * 
 * This service combines multiple backend API calls into single optimized requests.
 * Instead of making separate calls for collaborator data, positions, and teams,
 * the BFF layer returns everything needed in a single response.
 */
export const collaboratorsBFFService = {
  /**
   * Get all data needed for the collaborator form (create or edit)
   * This combines:
   * - Collaborator data (if editing)
   * - All positions for dropdown
   * - All teams for dropdown
   * 
   * @param id - Collaborator ID (optional, omit for create form)
   * @returns Combined response with collaborator data and reference lists
   */
  getFormData: async (id?: string): Promise<CollaboratorBFFResponse> => {
    try {
      const endpoint = id 
        ? `/collaborators/${id}/form-data`
        : '/collaborators/form-data';
      
      const response = await bffApiClient.get<CollaboratorBFFResponse>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborator form data from BFF:', error);
      throw new Error('Failed to fetch collaborator form data');
    }
  },

  /**
   * Get paginated list of collaborators with enriched data
   * This combines collaborator data with denormalized position and team information
   * 
   * @param page - Page number
   * @param pageSize - Number of items per page
   * @param search - Search term
   * @param filter - Filter field
   * @returns Paginated list with enriched collaborator data
   */
  getList: async (
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
    filter: string = ''
  ): Promise<CollaboratorListBFFResponse> => {
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

      const response = await bffApiClient.get<CollaboratorListBFFResponse>(
        `/collaborators?${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborators list from BFF:', error);
      throw new Error('Failed to fetch collaborators list');
    }
  },

  /**
   * Create a new collaborator
   * 
   * @param data - Collaborator data to create
   * @returns Created collaborator with full details
   */
  create: async (data: CollaboratorBFFRequest): Promise<Collaborator> => {
    try {
      const response = await bffApiClient.post<Collaborator>('/collaborators', data);
      return response.data;
    } catch (error) {
      console.error('Error creating collaborator through BFF:', error);
      throw new Error('Failed to create collaborator');
    }
  },

  /**
   * Update an existing collaborator
   * 
   * @param id - Collaborator ID
   * @param data - Updated collaborator data
   * @returns Updated collaborator with full details
   */
  update: async (id: string, data: Partial<CollaboratorBFFRequest>): Promise<Collaborator> => {
    try {
      const response = await bffApiClient.put<Collaborator>(`/collaborators/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating collaborator through BFF:', error);
      throw new Error('Failed to update collaborator');
    }
  },

  /**
   * Delete a collaborator
   * 
   * @param id - Collaborator ID
   */
  delete: async (id: string): Promise<void> => {
    try {
      await bffApiClient.delete(`/collaborators/${id}`);
    } catch (error) {
      console.error('Error deleting collaborator through BFF:', error);
      throw new Error('Failed to delete collaborator');
    }
  },
};
