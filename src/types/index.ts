// Position (Puesto)
export interface Position {
  id?: string;
  name: string;
}

// Collaborator (Colaborador)
export interface Collaborator {
  id: string;
  firstName: string;
  lastName: string;
  positionId: string;
  teamId: string;
  tags: string[];
}

// Development Team (Equipo de Desarrollo)
export interface Team {
  id: string; // UUID
  name: string;
  tags: string[];
}
