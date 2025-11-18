// Backend for Frontend (BFF) Type Definitions
// These types represent the combined data structures returned by the BFF layer

import { Collaborator, Position, Team } from './index';

/**
 * Combined response for Collaborator form/detail that includes
 * all necessary reference data in a single response
 */
export interface CollaboratorBFFResponse {
  // The collaborator data (null when creating new)
  collaborator: Collaborator | null;
  
  // Reference data for dropdowns
  positions: Position[];
  teams: Team[];
}

/**
 * Combined response for listing collaborators with enriched data
 */
export interface CollaboratorListBFFResponse {
  // Collaborators with denormalized data
  collaborators: Collaborator[];
  
  // Pagination info
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  
  // Optional metadata
  metadata?: {
    filters?: string[];
    [key: string]: unknown;
  };
}

/**
 * Request to create/update a collaborator through BFF
 */
export interface CollaboratorBFFRequest {
  firstName: string;
  lastName: string;
  positionId: string;
  teamId: string;
  tags: string[];
}
