# BFF Backend Implementation Example

This document provides example implementations for the BFF (Backend for Frontend) endpoints needed to support the front-end.

## Technology Options

The BFF layer can be implemented using various technologies:

- **Node.js + Express**: Simple and lightweight
- **Next.js API Routes**: If using Next.js
- **NestJS**: For more structure and TypeScript
- **Python + FastAPI**: If your backend is Python
- **Spring Boot**: If your backend is Java

## Express.js Example (Recommended)

### Setup

```bash
mkdir bff-service
cd bff-service
npm init -y
npm install express axios cors dotenv
npm install --save-dev typescript @types/express @types/node ts-node nodemon
```

### Project Structure

```
bff-service/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── services/
│   │   ├── apiClient.ts        # HTTP client for backend APIs
│   │   ├── collaborators.ts    # Collaborators API calls
│   │   ├── positions.ts        # Positions API calls
│   │   └── teams.ts            # Teams API calls
│   ├── routes/
│   │   └── collaborators.ts    # BFF routes for collaborators
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling
│   │   └── cache.ts           # Caching middleware
│   └── types/
│       └── index.ts            # TypeScript types
├── package.json
├── tsconfig.json
└── .env
```

### Configuration (src/config/env.ts)

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  backendApiUrl: process.env.BACKEND_API_URL || 'http://localhost:3000/api',
  cacheEnabled: process.env.CACHE_ENABLED === 'true',
  cacheTTL: parseInt(process.env.CACHE_TTL || '300000'), // 5 minutes
};
```

### API Client (src/services/apiClient.ts)

```typescript
import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.backendApiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Response Error: ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Backend Service Wrappers

#### Collaborators Service (src/services/collaborators.ts)

```typescript
import apiClient from './apiClient';
import { Collaborator } from '../types';

export const collaboratorsApi = {
  getById: async (id: string): Promise<Collaborator> => {
    const response = await apiClient.get(`/collaborators/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<Collaborator> => {
    const response = await apiClient.post('/collaborators', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<Collaborator> => {
    const response = await apiClient.put(`/collaborators/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/collaborators/${id}`);
  },
};
```

#### Positions Service (src/services/positions.ts)

```typescript
import apiClient from './apiClient';
import { Position } from '../types';

export const positionsApi = {
  getAll: async (): Promise<Position[]> => {
    const response = await apiClient.get('/positions', {
      headers: { 'X-dropdown': 'true' }
    });
    return response.data;
  },
};
```

#### Teams Service (src/services/teams.ts)

```typescript
import apiClient from './apiClient';
import { Team } from '../types';

export const teamsApi = {
  getAll: async (): Promise<Team[]> => {
    const response = await apiClient.get('/teams', {
      headers: { 'X-dropdown': 'true' }
    });
    // Handle both array and paginated response formats
    return Array.isArray(response.data) ? response.data : response.data.data;
  },
};
```

### BFF Routes (src/routes/collaborators.ts)

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { collaboratorsApi } from '../services/collaborators';
import { positionsApi } from '../services/positions';
import { teamsApi } from '../services/teams';
import { CacheService } from '../middleware/cache';

const router = Router();
const cache = new CacheService();

/**
 * GET /api/bff/collaborators/form-data
 * Get all data needed for creating a new collaborator
 */
router.get('/form-data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('📥 BFF Request: GET /collaborators/form-data');

    // Check cache first
    const cacheKey = 'collaborator-form-reference-data';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log('💾 Returning cached reference data');
      return res.json(cachedData);
    }

    // Fetch reference data in parallel
    const [positions, teams] = await Promise.all([
      positionsApi.getAll(),
      teamsApi.getAll(),
    ]);

    const responseData = {
      collaborator: null,
      positions,
      teams,
    };

    // Cache for 5 minutes
    cache.set(cacheKey, responseData, 5 * 60 * 1000);

    console.log('✅ BFF Response: Form data fetched successfully');
    res.json(responseData);
  } catch (error) {
    console.error('❌ BFF Error: Failed to fetch form data', error);
    next(error);
  }
});

/**
 * GET /api/bff/collaborators/:id/form-data
 * Get all data needed for editing an existing collaborator
 */
router.get('/:id/form-data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`📥 BFF Request: GET /collaborators/${id}/form-data`);

    // Fetch all data in parallel
    const [collaborator, positions, teams] = await Promise.all([
      collaboratorsApi.getById(id),
      positionsApi.getAll().catch(err => {
        console.warn('⚠️  Failed to fetch positions:', err.message);
        return [];
      }),
      teamsApi.getAll().catch(err => {
        console.warn('⚠️  Failed to fetch teams:', err.message);
        return [];
      }),
    ]);

    const responseData = {
      collaborator,
      positions,
      teams,
    };

    console.log('✅ BFF Response: Collaborator form data fetched successfully');
    res.json(responseData);
  } catch (error) {
    console.error(`❌ BFF Error: Failed to fetch collaborator ${req.params.id}`, error);
    next(error);
  }
});

/**
 * POST /api/bff/collaborators
 * Create a new collaborator
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('📥 BFF Request: POST /collaborators');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

    // Generate UUID if not provided
    const collaboratorData = {
      id: req.body.id || require('uuid').v4(),
      ...req.body,
    };

    const collaborator = await collaboratorsApi.create(collaboratorData);

    // Invalidate form data cache
    cache.delete('collaborator-form-reference-data');

    console.log('✅ BFF Response: Collaborator created successfully');
    res.status(201).json(collaborator);
  } catch (error) {
    console.error('❌ BFF Error: Failed to create collaborator', error);
    next(error);
  }
});

/**
 * PUT /api/bff/collaborators/:id
 * Update an existing collaborator
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`📥 BFF Request: PUT /collaborators/${id}`);
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

    const collaborator = await collaboratorsApi.update(id, req.body);

    console.log('✅ BFF Response: Collaborator updated successfully');
    res.json(collaborator);
  } catch (error) {
    console.error(`❌ BFF Error: Failed to update collaborator ${req.params.id}`, error);
    next(error);
  }
});

/**
 * DELETE /api/bff/collaborators/:id
 * Delete a collaborator
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`📥 BFF Request: DELETE /collaborators/${id}`);

    await collaboratorsApi.delete(id);

    console.log('✅ BFF Response: Collaborator deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error(`❌ BFF Error: Failed to delete collaborator ${req.params.id}`, error);
    next(error);
  }
});

export default router;
```

### Cache Middleware (src/middleware/cache.ts)

```typescript
import { config } from '../config/env';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

export class CacheService {
  private cache: Map<string, CacheEntry>;

  constructor() {
    this.cache = new Map();
    
    // Clean expired entries every minute
    setInterval(() => this.cleanExpired(), 60000);
  }

  get(key: string): any | null {
    if (!config.cacheEnabled) return null;

    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: any, ttl: number = config.cacheTTL): void {
    if (!config.cacheEnabled) return;

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Error Handler (src/middleware/errorHandler.ts)

```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('💥 Error:', err);

  // Axios error
  if (err.response) {
    return res.status(err.response.status).json({
      error: err.response.data?.error || err.message,
      details: err.response.data,
    });
  }

  // Generic error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};
```

### Main Application (src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import collaboratorsRouter from './routes/collaborators';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BFF' });
});

// BFF Routes
app.use('/api/bff/collaborators', collaboratorsRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 BFF Service running on http://localhost:${config.port}`);
  console.log(`📡 Backend API: ${config.backendApiUrl}`);
  console.log(`💾 Cache: ${config.cacheEnabled ? 'enabled' : 'disabled'}`);
});
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "watch": "tsc --watch"
  }
}
```

### Environment Variables (.env)

```bash
PORT=3001
BACKEND_API_URL=http://localhost:3000/api
CACHE_ENABLED=true
CACHE_TTL=300000
NODE_ENV=development
```

## Testing

### Manual Testing

```bash
# Start the BFF service
npm run dev

# Test form data endpoint
curl http://localhost:3001/api/bff/collaborators/form-data

# Test specific collaborator form data
curl http://localhost:3001/api/bff/collaborators/123/form-data

# Test create collaborator
curl -X POST http://localhost:3001/api/bff/collaborators \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "positionId": "pos-123",
    "teamId": "team-456",
    "tags": ["developer", "senior"]
  }'
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  bff:
    build: .
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - BACKEND_API_URL=http://backend:3000/api
      - CACHE_ENABLED=true
      - CACHE_TTL=300000
    depends_on:
      - backend
```

## Production Considerations

1. **Authentication**: Add JWT validation middleware
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Monitoring**: Add APM tools (New Relic, DataDog)
4. **Logging**: Use structured logging (Winston, Pino)
5. **Redis Cache**: Replace in-memory cache with Redis
6. **Load Balancing**: Use multiple instances with nginx/ALB
7. **Health Checks**: Implement detailed health endpoints
8. **Metrics**: Expose Prometheus metrics
9. **Circuit Breaker**: Handle backend failures gracefully
10. **CORS**: Configure proper CORS for production domains
