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
├── services/         # API service layer
│   ├── api.ts
│   ├── positionsService.ts
│   ├── collaboratorsService.ts
│   └── teamsService.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── i18n/             # Internationalization config
│   └── index.ts
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## License

This project is proprietary software.
