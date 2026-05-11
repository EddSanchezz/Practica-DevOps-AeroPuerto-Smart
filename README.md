# FlyTrack - AeroPuerto Smart

Sistema de gestión de vuelos del aeropuerto AeroPuerto Smart.

## Tech Stack

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **Frontend**: Angular 21
- **Docker**: Docker Compose
- **CI/CD**: GitHub Actions
- **Task Runner**: Task (go-task)

## Estructura del Proyecto

```
├── backend/           # API REST con FastAPI
├── frontend/          # Aplicación Angular
├── docker-compose.yml # Desarrollo local
├── Taskfile.yml       # Tareas automatizadas
└── .github/workflows/ # Pipeline CI/CD
```

## Uso de Task

Este proyecto incluye un `Taskfile.yml` para automatizar tareas de desarrollo:

```bash
# Ver todas las tareas disponibles
task list

# Desarrollo
task run           # Iniciar todos los servicios (Docker)
task run:backend   # Iniciar solo backend
task run:frontend # Iniciar solo frontend
task run:db       # Iniciar solo base de datos

# Testing
task test          # Ejecutar todos los tests
task test:backend # Tests de backend
task lint          # Linters

# Docker
task docker:up     # Docker compose up
task docker:down  # Docker compose down
task docker:prod  # Modo producción

# Setup
task install      # Instalar dependencias
task seed         # Cargar datos de demo
task clean        # Limpiar archivos temporales

# Health
task health       # Verificar estado de servicios
```

> **Nota**: Requiere tener instalado [Task](https://taskfile.dev/installation/)

##快速开始 (Desarrollo Local)

```bash
# 1. Clonar el repositorio
git clone https://github.com/<tu-usuario>/Practica-DevOps-AeroPuerto-Smart.git
cd Practica-DevOps-AeroPuerto-Smart

# 2. Iniciar con Docker Compose
docker-compose up -d

# 3. Acceder a la aplicación
# Frontend: http://localhost
# API: http://localhost:8000/docs
```

## Configuración de Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://flytrack:flytrack@localhost:5432/flytrack
SECRET_KEY=your-secret-key
DEBUG=true
CORS_ORIGINS=http://localhost,http://127.0.0.1,https://tu-frontend-en-produccion.com
```

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) |
| GET | `/api/auth/me` | Obtener usuario actual |
| GET | `/api/flights/` | Listar vuelos |
| GET | `/api/flights/search?q=` | Buscar vuelos |
| GET | `/api/flights/{id}` | Ver detalle de vuelo |
| POST | `/api/flights/` | Crear vuelo (auth) |
| PUT | `/api/flights/{id}` | Actualizar vuelo (auth) |
| DELETE | `/api/flights/{id}` | Eliminar vuelo (auth) |
| GET | `/api/luggage/` | Listar reportes |
| GET | `/api/luggage/{id}` | Ver reporte |
| POST | `/api/luggage/` | Crear reporte |
| PUT | `/api/luggage/{id}` | Actualizar reporte (auth) |
| DELETE | `/api/luggage/{id}` | Eliminar reporte (auth) |
| POST | `/api/seed/` | Cargar datos de demo |
| DELETE | `/api/seed/reset` | Eliminar todos los datos |

## Ramas Git

- `main` - Producción
- `develop` - Desarrollo
- `feature/*` - Nuevas funcionalidades

## Pipeline CI/CD

El pipeline incluye:
1. Lint (Flake8 + Black)
2. Tests (pytest)
3. Build Docker
4. Push a GitHub Container Registry
5. Deploy a producción (main branch)

## Licencia

MIT
