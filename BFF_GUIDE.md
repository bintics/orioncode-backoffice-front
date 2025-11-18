# Backend for Frontend (BFF) Pattern Guide

## Overview

This project implements a **Backend for Frontend (BFF)** pattern to optimize API calls and provide data structures that perfectly match the front-end component needs.

## Problem Statement

Previously, the front-end needed to make multiple API calls to render a single page:

```typescript
// OLD WAY - Multiple API calls
const positions = await positionsService.getAllForDropdown();
const teams = await teamsService.getAllForDropdown();
const collaborator = await collaboratorsService.getById(id);

// 3 separate HTTP requests!
```

This approach has several issues:
- **High latency**: Multiple round-trips to the server
- **Complex state management**: Managing loading states for multiple calls
- **Error handling complexity**: Each call can fail independently
- **Waterfall effect**: Some calls may depend on others completing first

## Solution: BFF Layer

The BFF layer combines multiple backend API calls into single optimized requests:

```typescript
// NEW WAY - Single BFF call
const formData = await collaboratorsBFFService.getFormData(id);
// Returns: { collaborator, positions, teams }

// Just 1 HTTP request! ✨
```

## Architecture

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ Single Request
       ▼
┌─────────────┐
│     BFF     │  ← Backend for Frontend Layer
│   Service   │     (Could be Express, Next.js API, etc.)
└──────┬──────┘
       │ Parallel Requests
       ├────────┬────────┐
       ▼        ▼        ▼
   ┌─────┐  ┌─────┐  ┌─────┐
   │ API │  │ API │  │ API │  ← Backend Microservices
   │  1  │  │  2  │  │  3  │
   └─────┘  └─────┘  └─────┘
```

## Implementation

### Directory Structure

```
src/
├── services/
│   ├── bff/                        # BFF layer services
│   │   ├── index.ts               # Exports all BFF services
│   │   ├── bffApi.ts              # BFF API client configuration
│   │   └── collaboratorsBFF.ts    # Collaborators BFF service
│   ├── api.ts                      # Original API client
│   ├── collaboratorsService.ts     # Original services (still available)
│   ├── positionsService.ts
│   └── teamsService.ts
├── types/
│   ├── index.ts                    # Original types
│   └── bff.ts                      # BFF-specific types
└── hooks/
    ├── useBFFCollaboratorForm.ts   # Hook using BFF
    └── useCollaboratorForm.ts      # Original hook (still available)
```

### Configuration

Add BFF configuration to your `.env` file:

```bash
# Optional: Override BFF base URL
# If not set, defaults to ${VITE_API_BASE_URL}/bff
VITE_BFF_BASE_URL=/api/bff
```

### Types

BFF types are defined in `src/types/bff.ts`:

```typescript
export interface CollaboratorBFFResponse {
  collaborator: Collaborator | null;  // null when creating
  positions: Position[];              // For dropdown
  teams: Team[];                      // For dropdown
}
```

### Services

BFF services are in `src/services/bff/`:

```typescript
import { collaboratorsBFFService } from '../services/bff';

// Get all form data in one call
const data = await collaboratorsBFFService.getFormData(id);

// Create collaborator
await collaboratorsBFFService.create(formData);

// Update collaborator
await collaboratorsBFFService.update(id, formData);
```

### Hooks

Use the BFF hook for simplified form management:

```typescript
import { useBFFCollaboratorForm } from '../hooks/useBFFCollaboratorForm';

const MyComponent = () => {
  const {
    formData,
    positions,    // Already loaded!
    teams,        // Already loaded!
    loading,      // Single loading state
    error,        // Single error state
    handleSubmit,
    // ... other handlers
  } = useBFFCollaboratorForm();
  
  // All data loaded in one request!
};
```

## Migration Guide

### Step 1: Keep Both Approaches

Both the original services and BFF services are available. This allows gradual migration:

```typescript
// Original approach (still works)
import { useCollaboratorForm } from './useCollaboratorForm';

// New BFF approach
import { useBFFCollaboratorForm } from '../hooks/useBFFCollaboratorForm';
```

### Step 2: Update Components

Replace the old hook with the new BFF hook:

```typescript
// Before
const { ... } = useCollaboratorForm();

// After
const { ... } = useBFFCollaboratorForm();
```

The API is identical, so no other changes needed!

### Step 3: Backend Implementation

The BFF layer needs to be implemented on the backend. Example endpoints:

```typescript
// GET /api/bff/collaborators/form-data
// Returns: { collaborator: null, positions: [...], teams: [...] }

// GET /api/bff/collaborators/:id/form-data
// Returns: { collaborator: {...}, positions: [...], teams: [...] }

// POST /api/bff/collaborators
// Creates collaborator and returns full data

// PUT /api/bff/collaborators/:id
// Updates collaborator and returns full data
```

Example Express.js implementation:

```javascript
app.get('/api/bff/collaborators/form-data', async (req, res) => {
  try {
    // Fetch data in parallel
    const [positions, teams] = await Promise.all([
      positionsApi.getAll(),
      teamsApi.getAll()
    ]);
    
    res.json({
      collaborator: null,
      positions,
      teams
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bff/collaborators/:id/form-data', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch data in parallel
    const [collaborator, positions, teams] = await Promise.all([
      collaboratorsApi.getById(id),
      positionsApi.getAll(),
      teamsApi.getAll()
    ]);
    
    res.json({
      collaborator,
      positions,
      teams
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Benefits

### ✅ Performance
- **Reduced latency**: 1 request instead of 3
- **Parallel backend calls**: BFF can fetch from multiple services simultaneously
- **Lower bandwidth**: Optimized payload structure

### ✅ Developer Experience
- **Simpler code**: Single API call, single loading state
- **Better error handling**: One try-catch block instead of multiple
- **Type safety**: Strong TypeScript types for combined responses

### ✅ Maintainability
- **Centralized logic**: Data combination logic in one place
- **Easier testing**: Single endpoint to test
- **Flexible**: Easy to add caching, rate limiting, etc.

## Advanced Patterns

### Caching

Add caching to reference data (positions, teams) in the BFF layer:

```javascript
const cache = new Map();

app.get('/api/bff/collaborators/form-data', async (req, res) => {
  let positions = cache.get('positions');
  let teams = cache.get('teams');
  
  if (!positions || !teams) {
    [positions, teams] = await Promise.all([
      positionsApi.getAll(),
      teamsApi.getAll()
    ]);
    
    cache.set('positions', positions);
    cache.set('teams', teams);
    
    // Invalidate cache after 5 minutes
    setTimeout(() => {
      cache.delete('positions');
      cache.delete('teams');
    }, 5 * 60 * 1000);
  }
  
  res.json({ collaborator: null, positions, teams });
});
```

### Error Handling

Handle partial failures gracefully:

```javascript
app.get('/api/bff/collaborators/:id/form-data', async (req, res) => {
  try {
    const { id } = req.params;
    
    const results = await Promise.allSettled([
      collaboratorsApi.getById(id),
      positionsApi.getAll(),
      teamsApi.getAll()
    ]);
    
    if (results[0].status === 'rejected') {
      // Collaborator not found - this is critical
      return res.status(404).json({ error: 'Collaborator not found' });
    }
    
    // Return what we have, even if some calls failed
    res.json({
      collaborator: results[0].value,
      positions: results[1].status === 'fulfilled' ? results[1].value : [],
      teams: results[2].status === 'fulfilled' ? results[2].value : [],
      warnings: [
        results[1].status === 'rejected' && 'Failed to load positions',
        results[2].status === 'rejected' && 'Failed to load teams',
      ].filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

### Frontend Unit Tests

```typescript
import { collaboratorsBFFService } from '../services/bff';

jest.mock('../services/bff/bffApi');

test('getFormData returns combined data', async () => {
  const mockData = {
    collaborator: null,
    positions: [{ id: '1', name: 'Developer' }],
    teams: [{ id: '1', name: 'Team A' }]
  };
  
  bffApiClient.get.mockResolvedValue({ data: mockData });
  
  const result = await collaboratorsBFFService.getFormData();
  
  expect(result).toEqual(mockData);
  expect(bffApiClient.get).toHaveBeenCalledWith('/collaborators/form-data');
});
```

### Backend Integration Tests

```javascript
describe('BFF Endpoints', () => {
  it('GET /api/bff/collaborators/form-data returns all reference data', async () => {
    const response = await request(app)
      .get('/api/bff/collaborators/form-data')
      .expect(200);
    
    expect(response.body).toHaveProperty('collaborator', null);
    expect(response.body).toHaveProperty('positions');
    expect(response.body).toHaveProperty('teams');
    expect(Array.isArray(response.body.positions)).toBe(true);
    expect(Array.isArray(response.body.teams)).toBe(true);
  });
});
```

## Best Practices

1. **Keep original services**: Don't delete old services during migration
2. **Use TypeScript**: Define strong types for BFF responses
3. **Error handling**: Handle partial failures gracefully
4. **Caching**: Cache reference data when appropriate
5. **Monitoring**: Log BFF requests for debugging
6. **Documentation**: Keep this guide updated as patterns evolve

## Future Enhancements

- [ ] Implement BFF for Teams module
- [ ] Implement BFF for Positions module
- [ ] Add request/response caching
- [ ] Add GraphQL layer for more flexible queries
- [ ] Implement real-time updates with WebSockets
- [ ] Add request batching for multiple operations

## Resources

- [BFF Pattern - Sam Newman](https://samnewman.io/patterns/architectural/bff/)
- [GraphQL vs BFF](https://blog.logrocket.com/understanding-backend-for-frontend-pattern/)
- [Micro Frontends - BFF Pattern](https://micro-frontends.org/)
