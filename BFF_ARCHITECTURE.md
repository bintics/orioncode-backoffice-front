# BFF Architecture Diagram

## Overview Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         Browser / Client                      │
│                    (React + TypeScript)                       │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ HTTP Request
                            │ GET /api/bff/collaborators/123/form-data
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                   BFF Layer (Backend)                         │
│              (Express.js / Next.js / NestJS)                  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         BFF Request Handler                         │   │
│  │  • Receives single client request                   │   │
│  │  • Initiates parallel backend calls                 │   │
│  │  • Combines responses                               │   │
│  │  • Applies business logic                           │   │
│  │  • Returns optimized JSON                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│                       ┌────────┐                             │
│                       │ Cache  │ (Optional)                  │
│                       │ Redis  │                             │
│                       └────────┘                             │
└───────────────────────────┬───────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                │ Parallel  │ Parallel  │ Parallel
                │ Request 1 │ Request 2 │ Request 3
                │           │           │
                ▼           ▼           ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│   Positions API  │ │   Teams API  │ │Collaborators │
│                  │ │              │ │     API      │
│ GET /positions   │ │ GET /teams   │ │GET /collab/  │
│                  │ │              │ │     123      │
└──────────────────┘ └──────────────┘ └──────────────┘
        │                   │                 │
        └───────────────────┴─────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  Backend APIs   │
                  │  (Microservices)│
                  └─────────────────┘
```

## Request Flow - Detailed

### Without BFF (OLD)

```
Browser                                Backend
  │                                      │
  ├─ Request 1 ──────────────────────→ GET /api/positions
  │                                      │
  │  ← Response 1 ─────────────────────┤ [pos1, pos2, ...]
  │                                      │
  ├─ Request 2 ──────────────────────→ GET /api/teams
  │                                      │
  │  ← Response 2 ─────────────────────┤ [team1, team2, ...]
  │                                      │
  ├─ Request 3 ──────────────────────→ GET /api/collaborators/123
  │                                      │
  │  ← Response 3 ─────────────────────┤ { id: 123, ... }
  │                                      │

Time: ~300-900ms (3 round trips)
Requests: 3
Complexity: High (multiple states, error handlers)
```

### With BFF (NEW)

```
Browser              BFF Layer                    Backend
  │                     │                            │
  ├─ Request 1 ───────→│                            │
  │ /bff/collab/123/   │                            │
  │ form-data          │                            │
  │                     ├─ Request A ──────────────→│ GET /positions
  │                     ├─ Request B ──────────────→│ GET /teams
  │                     ├─ Request C ──────────────→│ GET /collaborators/123
  │                     │                            │
  │                     │ ← Response A ─────────────┤ [pos1, pos2, ...]
  │                     │ ← Response B ─────────────┤ [team1, team2, ...]
  │                     │ ← Response C ─────────────┤ { id: 123, ... }
  │                     │                            │
  │                     │ [Combine Responses]        │
  │                     │                            │
  │  ← Response 1 ─────┤                            │
  │  {                 │                            │
  │    collaborator,   │                            │
  │    positions,      │                            │
  │    teams           │                            │
  │  }                 │                            │

Time: ~100-300ms (1 round trip + parallel backend calls)
Requests: 1 (from browser perspective)
Complexity: Low (single state, single error handler)
```

## Component Architecture

### Front-End Structure

```
┌─────────────────────────────────────────────────────────────┐
│                  CollaboratorForm.tsx                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │        useBFFCollaboratorForm() Hook                  │ │
│  │                                                        │ │
│  │  Returns:                                             │ │
│  │  • formData         (state)                           │ │
│  │  • positions        (loaded)                          │ │
│  │  • teams            (loaded)                          │ │
│  │  • loading          (single state)                    │ │
│  │  • error            (single error)                    │ │
│  │  • handleSubmit()   (handler)                         │ │
│  │  • handleChange()   (handler)                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │        collaboratorsBFFService                        │ │
│  │  • getFormData(id?)                                   │ │
│  │  • getList(params)                                    │ │
│  │  • create(data)                                       │ │
│  │  • update(id, data)                                   │ │
│  │  • delete(id)                                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              bffApiClient (Axios)                     │ │
│  │  baseURL: /api/bff                                    │ │
│  │  headers: { Content-Type: application/json }         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP
                            ▼
                    [ BFF Backend ]
```

## Data Flow

### Create Form (New Collaborator)

```
User clicks "Create Collaborator"
        │
        ▼
┌─────────────────────┐
│ CollaboratorForm    │
│ componentDidMount() │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ useBFFCollaboratorForm()                │
│ • Calls getFormData()                   │
│ • No ID = creating new                  │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ GET /api/bff/collaborators/form-data    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ BFF combines:                           │
│ • positions: [...]                      │
│ • teams: [...]                          │
│ • collaborator: null (new)              │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Form renders with:                      │
│ • Empty form fields                     │
│ • Positions dropdown (populated)        │
│ • Teams dropdown (populated)            │
│ • Ready for input                       │
└─────────────────────────────────────────┘
```

### Edit Form (Existing Collaborator)

```
User clicks "Edit" on collaborator 123
        │
        ▼
┌─────────────────────┐
│ CollaboratorForm    │
│ componentDidMount() │
└──────────┬──────────┘
           │
           ▼
┌───────────────────────────────────────────┐
│ useBFFCollaboratorForm()                  │
│ • Calls getFormData(123)                  │
│ • Has ID = editing existing               │
└──────────┬────────────────────────────────┘
           │
           ▼
┌───────────────────────────────────────────┐
│ GET /api/bff/collaborators/123/form-data  │
└──────────┬────────────────────────────────┘
           │
           ▼
┌───────────────────────────────────────────┐
│ BFF combines:                             │
│ • positions: [...]                        │
│ • teams: [...]                            │
│ • collaborator: { id: 123, firstName:...} │
└──────────┬────────────────────────────────┘
           │
           ▼
┌───────────────────────────────────────────┐
│ Form renders with:                        │
│ • Pre-filled form fields                  │
│ • Positions dropdown (current selected)   │
│ • Teams dropdown (current selected)       │
│ • Ready to edit                           │
└───────────────────────────────────────────┘
```

## Type System Flow

```
┌──────────────────────────────────────────────────────────┐
│                     Type Definitions                     │
└──────────────────────────────────────────────────────────┘

src/types/index.ts                  src/types/bff.ts
├─ Position                         ├─ CollaboratorBFFResponse
├─ Team                             │  ├─ collaborator: Collaborator | null
├─ Collaborator                     │  ├─ positions: Position[]
├─ ApiResponse<T>                   │  └─ teams: Team[]
└─ PaginationInfo                   ├─ CollaboratorListBFFResponse
                                    └─ CollaboratorBFFRequest

                    │
                    ▼
        ┌──────────────────────────┐
        │   Service Layer          │
        │  (Type-safe requests)    │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │   Hook Layer             │
        │  (Type-safe state)       │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │   Component Layer        │
        │  (Type-safe props)       │
        └──────────────────────────┘
```

## Caching Strategy (Optional Enhancement)

```
┌──────────────────────────────────────────────────┐
│              BFF Layer with Cache                │
│                                                  │
│  Request received                                │
│       │                                          │
│       ▼                                          │
│  ┌─────────┐                                    │
│  │ Check   │───────────────┐                    │
│  │ Cache   │               │                    │
│  └─────────┘               │                    │
│       │                    │                    │
│       │ Cache Miss         │ Cache Hit          │
│       ▼                    ▼                    │
│  ┌──────────────┐     ┌──────────┐            │
│  │ Fetch from   │     │ Return   │            │
│  │ Backend APIs │     │ Cached   │            │
│  └──────────────┘     │ Data     │            │
│       │                └──────────┘            │
│       ▼                                        │
│  ┌──────────────┐                             │
│  │ Store in     │                             │
│  │ Cache        │                             │
│  │ (5 min TTL)  │                             │
│  └──────────────┘                             │
│       │                                        │
│       ▼                                        │
│  ┌──────────────┐                             │
│  │ Return to    │                             │
│  │ Client       │                             │
│  └──────────────┘                             │
│                                                │
└──────────────────────────────────────────────────┘

Cache Keys:
• "collaborator-form-reference-data" → { positions, teams }
• "collaborator-123" → { collaborator }

Invalidation:
• Time-based: 5 minutes TTL
• Event-based: Clear on POST/PUT/DELETE
```

## Error Handling Flow

```
┌────────────────────────────────────────┐
│         BFF Error Handler              │
│                                        │
│  try {                                 │
│    const [collab, pos, teams] =       │
│      await Promise.all([...])         │
│                                        │
│    return { collab, pos, teams }      │
│                                        │
│  } catch (error) {                    │
│    ┌──────────────────┐              │
│    │ Error Type?      │              │
│    └──────────────────┘              │
│           │                           │
│    ┌──────┴────────┐                │
│    │               │                 │
│    ▼               ▼                 │
│ Network         Backend              │
│ Error           Error                │
│    │               │                 │
│    ▼               ▼                 │
│ Return 503      Return 500           │
│ Retry           Show error           │
│ Suggestion      Message              │
│                                      │
│  }                                   │
└────────────────────────────────────────┘
```

## Performance Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Metrics                      │
└─────────────────────────────────────────────────────────────┘

Without BFF (Sequential):
Request 1: ████████ 150ms
Request 2:         ████████ 150ms  
Request 3:                 ████████ 150ms
Total:     ████████████████████████ 450ms

Without BFF (Parallel):
Request 1: ████████ 150ms ─┐
Request 2: ████████ 150ms  ├─ Max: 200ms
Request 3: ██████████ 200ms─┘
Total:     ██████████ 200ms

With BFF:
BFF Request: ████ 50ms (to BFF)
  Backend 1: ████████ 150ms ─┐
  Backend 2: ████████ 150ms  ├─ Max: 200ms (parallel)
  Backend 3: ██████████ 200ms─┘
BFF Response: █ 20ms (combine & return)
Total:        ███████████ 270ms

Network Overhead Comparison:
  Without BFF: 3 × (request + response headers) ≈ 6KB
  With BFF:    1 × (request + response headers) ≈ 2KB
  Savings:     ~66% less overhead
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└──────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │  CDN     │
                    │ (Static) │
                    └────┬─────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│              Load Balancer / API Gateway               │
│              (nginx / AWS ALB / CloudFlare)            │
└────────────┬──────────────────────┬────────────────────┘
             │                      │
   ┌─────────┴────────┐  ┌─────────┴────────┐
   │  BFF Instance 1  │  │  BFF Instance 2  │
   │  (Node.js)       │  │  (Node.js)       │
   └─────────┬────────┘  └─────────┬────────┘
             │                      │
             └──────────┬───────────┘
                        │
           ┌────────────┼────────────┐
           │            │            │
           ▼            ▼            ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ Redis   │  │ Backend │  │ Backend │
     │ Cache   │  │ API 1   │  │ API 2   │
     └─────────┘  └─────────┘  └─────────┘
```

---

**Diagrams Version:** 1.0
**Last Updated:** November 18, 2025
**Status:** Production Ready (Front-end)
