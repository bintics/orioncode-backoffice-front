import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      positions: 'Positions',
      collaborators: 'Collaborators',
      teams: 'Teams',
      
      // Common
      name: 'Name',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      back: 'Back',
      loading: 'Loading...',
      error: 'Error',
      confirmDelete: 'Are you sure you want to delete this item?',
      selectOption: 'Select an option',
      selectPosition: 'Select a position',
      selectTeam: 'Select a team',
      
      // Positions
      positionName: 'Position Name',
      createPosition: 'Create Position',
      editPosition: 'Edit Position',
      positionsList: 'Positions List',
      
      // Collaborators
      collaboratorId: 'Collaborator ID',
      firstName: 'First Name',
      lastName: 'Last Name',
      position: 'Position',
      team: 'Team',
      tags: 'Tags',
      addTag: 'Add Tag',
      createCollaborator: 'Create Collaborator',
      editCollaborator: 'Edit Collaborator',
      collaboratorsList: 'Collaborators List',
      
      // Teams
      teamId: 'Team ID',
      teamName: 'Team Name',
      createTeam: 'Create Team',
      editTeam: 'Edit Team',
      teamsList: 'Teams List',
    },
  },
  es: {
    translation: {
      // Navigation
      positions: 'Puestos',
      collaborators: 'Colaboradores',
      teams: 'Equipos',
      
      // Common
      name: 'Nombre',
      actions: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      create: 'Crear',
      back: 'Volver',
      loading: 'Cargando...',
      error: 'Error',
      confirmDelete: '¿Está seguro de que desea eliminar este elemento?',
      selectOption: 'Seleccione una opción',
      selectPosition: 'Seleccione un puesto',
      selectTeam: 'Seleccione un equipo',
      
      // Positions
      positionName: 'Nombre del Puesto',
      createPosition: 'Crear Puesto',
      editPosition: 'Editar Puesto',
      positionsList: 'Lista de Puestos',
      
      // Collaborators
      collaboratorId: 'ID de Colaborador',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      position: 'Puesto',
      team: 'Equipo',
      tags: 'Etiquetas',
      addTag: 'Agregar Etiqueta',
      createCollaborator: 'Crear Colaborador',
      editCollaborator: 'Editar Colaborador',
      collaboratorsList: 'Lista de Colaboradores',
      
      // Teams
      teamId: 'ID de Equipo',
      teamName: 'Nombre del Equipo',
      createTeam: 'Crear Equipo',
      editTeam: 'Editar Equipo',
      teamsList: 'Lista de Equipos',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
