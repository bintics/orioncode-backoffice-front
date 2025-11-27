
## Pagina principal (home)
El login aún no se encuentra, suponiendo que ya iniciamos sesion, la página principal deberia mostrar la información del equipo al que pertenesco, los integrantes del equipo y el puesto que tiene cada integrante del equipo, esto con el proposito de facilitar la búsqueda de los owner del proyecto.

Además debe de mostrarse una tabla con todos los proyectos de los que es owner el equipo al que pertenesco, adicional una opción que me permita buscar en todos los proyectos existentes además de los proyectos de mi equipo.

## API para obtener información del equipo:
GET: /api/teams/{teamId}
Respuesta:
```json
{
    "id": "team-006",
    "name": "Arquitectura de Software",
    "description": "Equipo encargado del diseño arquitectónico y decisiones técnicas estratégicas",
    "createdAt": "2025-11-21T19:26:08",
    "updatedAt": "2025-11-21T19:26:08"
}
```

## API para obtener a los miebros del equipo:
GET: /api/collaborators?search={teamId}&filter=teamId

Donde {teamId} se sustituye por su respectivo teamId

Respuesta:
```json
{
    "data": [
        {
            "id": "coll-0106",
            "firstName": "Ana",
            "lastName": "Martínez",
            "positionId": "pos-001",
            "teamId": "team-001",
            "tags": [],
            "createdAt": "2025-11-21T19:27:10",
            "updatedAt": "2025-11-21T19:27:10"
        },
        {
            "id": "coll-0031",
            "firstName": "Andrés",
            "lastName": "Morales",
            "positionId": "pos-001",
            "teamId": "team-001",
            "tags": [],
            "createdAt": "2025-11-21T19:26:26",
            "updatedAt": "2025-11-21T19:26:26"
        }
    ],
    "pagination": {
        "page": 1,
        "pageSize": 2,
        "totalItems": 9,
        "totalPages": 5
    },
    "metadata": {
        "filters": [
            "firstName",
            "lastName",
            "teamId",
            "positionId"
        ]
    }
}
```

## API para obtener proyectos
GET: /api/projects?filter=ownerId&search={teamId}

Donde {teamId} corresponde al id del equipo para obtener únicamente los proyectos del equipo.

Respuesta:
```json
{
    "data": [
        {
            "id": 5,
            "name": "Automated Testing Suite",
            "description": "Suite de pruebas automatizadas end-to-end",
            "status": "ACTIVE",
            "type": "TOOLING",
            "ownerId": "team-005",
            "createdAt": "2025-11-27T11:32:02",
            "updatedAt": "2025-11-27T11:32:02"
        },
        {
            "id": 20,
            "name": "Load Testing Framework",
            "description": "Framework para pruebas de carga y rendimiento",
            "status": "DRAFT",
            "type": "TOOLING",
            "ownerId": "team-005",
            "createdAt": "2025-11-27T11:32:02",
            "updatedAt": "2025-11-27T11:32:02"
        }
    ],
    "pagination": {
        "page": 1,
        "pageSize": 20,
        "totalItems": 2,
        "totalPages": 1
    },
    "metadata": {
        "filters": [
            "name",
            "description",
            "status",
            "type",
            "ownerId"
        ]
    }
}
```