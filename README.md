# OrionCode Backoffice Front

React TypeScript front-end application for OrionCode backoffice administration.

## Features

This application provides three main administration modules:

### 1. Positions Administration (Administración de Puestos)
- Create, read, update, and delete positions
- Fields: Position name

### 2. Collaborators Administration (Administración de Colaboradores)
- Create, read, update, and delete collaborators
- Fields:
  - Collaborator ID
  - First name (Nombre)
  - Last name (Apellidos)
  - Position (Puesto)
  - Team (Equipo)
  - Tags for classification

### 3. Development Teams Administration (Administración de Equipos de Desarrollo)
- Create, read, update, and delete development teams
- Fields:
  - Team ID (UUID)
  - Team name
  - Tags for classification

## Internationalization

The application supports both Spanish (default) and English languages. You can toggle between languages using the language switcher button in the navigation bar.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Lint

Run ESLint:
```bash
npm run lint
```

### Preview

Preview the production build:
```bash
npm run preview
```

## API Integration

The application connects to a REST API with the following endpoints:

### Positions
- `GET /api/positions` - List all positions
- `GET /api/positions/:id` - Get position by ID
- `POST /api/positions` - Create new position
- `PUT /api/positions/:id` - Update position
- `DELETE /api/positions/:id` - Delete position

### Collaborators
- `GET /api/collaborators` - List all collaborators
- `GET /api/collaborators/:id` - Get collaborator by ID
- `POST /api/collaborators` - Create new collaborator
- `PUT /api/collaborators/:id` - Update collaborator
- `DELETE /api/collaborators/:id` - Delete collaborator

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

## Backend for Frontend (BFF) Layer

This project includes a **Backend for Frontend (BFF)** pattern implementation to optimize API calls and provide data structures that perfectly match the front-end component needs.

### What is BFF?

Instead of making multiple API calls to different endpoints, the BFF layer combines them into a single optimized request:

```typescript
// OLD WAY - 3 separate requests
const positions = await positionsService.getAllForDropdown();
const teams = await teamsService.getAllForDropdown();
const collaborator = await collaboratorsService.getById(id);

// NEW WAY - 1 BFF request
const formData = await collaboratorsBFFService.getFormData(id);
// Returns: { collaborator, positions, teams }
```

### BFF Endpoints

The BFF layer provides optimized endpoints that combine multiple backend calls:

#### Collaborators BFF
- `GET /api/bff/collaborators/form-data` - Get all data for creating a new collaborator (positions + teams)
- `GET /api/bff/collaborators/:id/form-data` - Get all data for editing a collaborator (collaborator + positions + teams)
- `POST /api/bff/collaborators` - Create new collaborator
- `PUT /api/bff/collaborators/:id` - Update collaborator
- `DELETE /api/bff/collaborators/:id` - Delete collaborator

### Benefits

✅ **Performance**: 1 request instead of 3
✅ **Reduced Latency**: Parallel backend calls on the server
✅ **Simpler Code**: Single loading state, single error handler
✅ **Type Safety**: Strong TypeScript types for combined responses

### Documentation

- **[BFF_GUIDE.md](./BFF_GUIDE.md)** - Complete guide on using the BFF pattern in this project
- **[BFF_BACKEND_EXAMPLE.md](./BFF_BACKEND_EXAMPLE.md)** - Backend implementation example with Express.js

### Configuration

Configure the BFF endpoint in your `.env` file:

```bash
# Optional: Override BFF base URL
# If not set, defaults to ${VITE_API_BASE_URL}/bff
VITE_BFF_BASE_URL=/api/bff
```

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React i18next** - Internationalization
- **Axios** - HTTP client for API calls
- **CSS** - Styling

## Project Structure

```
src/
├── components/        # Reusable components
│   └── Navigation.tsx
├── pages/            # Page components
│   ├── positions/
│   ├── collaborators/
│   └── teams/
├── bff/              # Backend for Frontend (all BFF code)
│   ├── services/
│   │   ├── index.ts
│   │   ├── bffApi.ts
│   │   └── collaboratorsBFF.ts
│   ├── hooks/
│   │   └── useBFFCollaboratorForm.ts
│   ├── types/
│   │   └── bff.ts
│   └── index.ts     # Main BFF exports
├── services/         # API service layer
│   ├── api.ts
│   ├── positionsService.ts
│   ├── collaboratorsService.ts
│   └── teamsService.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── hooks/            # Custom React hooks
│   └── ...
├── i18n/             # Internationalization config
│   └── index.ts
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## License

This project is proprietary software.
