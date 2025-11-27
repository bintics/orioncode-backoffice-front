import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      positions: 'Positions',
      collaborators: 'Collaborators',
      teams: 'Teams',
      configuration: 'Configuration',
      
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
      description: 'Description',
      
      // Search and Filter
      filterByField: 'Filter by field:',
      allFields: 'All fields',
      searchInAllFields: 'Search in all fields...',
      searchInField: 'Value for {{field}}...',
      apply: 'Apply',
      applying: 'Applying...',
      clear: 'Clear',
      activeFilter: 'Active filter:',
      
      // Positions
      positionName: 'Position Name',
      createPosition: 'Create Position',
      editPosition: 'Edit Position',
      positionsList: 'Positions List',
      enterPositionName: 'Enter position name',
      enterDescription: 'Enter description (optional)',
      saving: 'Saving...',
      
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
      personalInfo: 'Personal Information',
      workInfo: 'Work Information',
      enterFirstName: 'Enter first name',
      enterLastName: 'Enter last name',
      
      // Teams
      teamId: 'Team ID',
      teamName: 'Team Name',
      createTeam: 'Create Team',
      editTeam: 'Edit Team',
      teamsList: 'Teams List',
      teamInfo: 'Team Information',
      enterTeamName: 'Enter team name',
      enterTag: 'Enter a tag',
      add: 'Add',
      
      // Empty states
      noPositions: 'No positions found',
      noTeams: 'No teams found',
      noCollaborators: 'No collaborators found',
      noProjects: 'No projects found',
      
      // Home page
      home: 'Home',
      myTeam: 'My Team',
      teamMembers: 'Team Members',
      member: 'Member',
      teamProjects: 'Team Projects',
      allProjects: 'All Projects',
      showAllProjects: 'Show All Projects',
      showTeamProjects: 'Show Team Projects Only',
      projectName: 'Project Name',
      projectDescription: 'Description',
      projectStatus: 'Status',
      projectType: 'Type',
      owner: 'Owner',
      
      // Project statuses
      ACTIVE: 'Active',
      DRAFT: 'Draft',
      ARCHIVED: 'Archived',
      
      // Project types
      PRODUCT: 'Product',
      TOOLING: 'Tooling',
      SERVICE: 'Service',
    },
  },
  es: {
    translation: {
      // Navigation
      positions: 'Puestos',
      collaborators: 'Colaboradores',
      teams: 'Equipos',
      configuration: 'Configuración',
      
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
      description: 'Descripción',
      
      // Search and Filter
      filterByField: 'Filtrar por campo:',
      allFields: 'Todos los campos',
      searchInAllFields: 'Buscar en todos los campos...',
      searchInField: 'Valor para {{field}}...',
      apply: 'Aplicar',
      applying: 'Aplicando...',
      clear: 'Limpiar',
      activeFilter: 'Filtro activo:',
      
      // Positions
      positionName: 'Nombre del Puesto',
      createPosition: 'Crear Puesto',
      editPosition: 'Editar Puesto',
      positionsList: 'Lista de Puestos',
      enterPositionName: 'Ingrese el nombre del puesto',
      enterDescription: 'Ingrese una descripción (opcional)',
      saving: 'Guardando...',
      
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
      personalInfo: 'Información Personal',
      workInfo: 'Información Laboral',
      enterFirstName: 'Ingrese el nombre',
      enterLastName: 'Ingrese el apellido',
      
      // Teams
      teamId: 'ID de Equipo',
      teamName: 'Nombre del Equipo',
      createTeam: 'Crear Equipo',
      editTeam: 'Editar Equipo',
      teamsList: 'Lista de Equipos',
      teamInfo: 'Información del Equipo',
      enterTeamName: 'Ingrese el nombre del equipo',
      enterTag: 'Ingrese una etiqueta',
      add: 'Agregar',
      
      // Empty states
      noPositions: 'No se encontraron puestos',
      noTeams: 'No se encontraron equipos',
      noCollaborators: 'No se encontraron colaboradores',
      noProjects: 'No se encontraron proyectos',
      
      // Home page
      home: 'Inicio',
      myTeam: 'Mi Equipo',
      teamMembers: 'Miembros del Equipo',
      member: 'Miembro',
      teamProjects: 'Proyectos del Equipo',
      allProjects: 'Todos los Proyectos',
      showAllProjects: 'Mostrar Todos los Proyectos',
      showTeamProjects: 'Mostrar Solo Proyectos del Equipo',
      projectName: 'Nombre del Proyecto',
      projectDescription: 'Descripción',
      projectStatus: 'Estado',
      projectType: 'Tipo',
      owner: 'Propietario',
      
      // Project statuses
      ACTIVE: 'Activo',
      DRAFT: 'Borrador',
      ARCHIVED: 'Archivado',
      
      // Project types
      PRODUCT: 'Producto',
      TOOLING: 'Herramienta',
      SERVICE: 'Servicio',
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
