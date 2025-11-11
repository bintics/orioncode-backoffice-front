// Interfaces genéricas para paginación
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiMetadata {
  filters?: string[];
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  metadata?: ApiMetadata;
}

// Position (Puesto)
export interface Position {
  id?: string;
  name: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Team (Equipo de Desarrollo)
export interface Team {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Collaborator (Colaborador) - Nueva estructura del backend
export interface Collaborator {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  team: {
    id: string;
    name: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Tipos específicos para las respuestas de API
export type PositionsResponse = ApiResponse<Position>;
export type TeamsResponse = ApiResponse<Team>;
export type CollaboratorsResponse = ApiResponse<Collaborator>;
