/**
 * Backend for Frontend (BFF) Module
 * 
 * This module contains all BFF-related code organized in one place
 * to avoid confusion between front-end and BFF code.
 * 
 * Structure:
 * - services/: BFF API services
 * - hooks/: BFF-specific React hooks
 * - types/: BFF-specific TypeScript types
 */

// Export services
export { collaboratorsBFFService, bffApiClient } from './services';

// Export hooks
export { useBFFCollaboratorForm } from './hooks/useBFFCollaboratorForm';

// Export types
export type {
  CollaboratorBFFResponse,
  CollaboratorListBFFResponse,
  CollaboratorBFFRequest,
} from './types/bff';
