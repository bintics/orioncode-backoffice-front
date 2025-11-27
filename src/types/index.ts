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

// Tipo específico para crear posiciones (enviar al backend)
export interface CreatePositionRequest {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
}

// Tipo específico para actualizar posiciones
export interface UpdatePositionRequest {
  name?: string;
  description?: string;
  tags?: string[];
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

// Tipo específico para crear equipos (enviar al backend)
export interface CreateTeamRequest {
  id: string;
  name: string;
  description: string;
}

// Tipo específico para actualizar equipos
export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  tags?: string[];
}

// CollaboratorView (Colaborador con referencias expandidas)
export interface CollaboratorView {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  team: Team;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Collaborator (Colaborador) - Nueva estructura del backend
export interface Collaborator {
  id: string;
  firstName: string;
  lastName: string;
  positionId: string;
  teamId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Tipo específico para crear colaboradores (enviar al backend)
export interface CreateCollaboratorRequest {
  id: string;
  firstName: string;
  lastName: string;
  positionId: string;
  teamId: string;
  tags: string[];
}

// Tipo específico para actualizar colaboradores
export interface UpdateCollaboratorRequest {
  firstName?: string;
  lastName?: string;
  positionId?: string;
  teamId?: string;
  tags?: string[];
}

// Project (Proyecto)
export type ProjectStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
export type ProjectType = 'PRODUCT' | 'TOOLING' | 'SERVICE';

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  type: ProjectType;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}// Tipos específicos para las respuestas de API
export type PositionsResponse = ApiResponse<Position>;
export type TeamsResponse = ApiResponse<Team>;
export type CollaboratorsResponse = ApiResponse<Collaborator>;
