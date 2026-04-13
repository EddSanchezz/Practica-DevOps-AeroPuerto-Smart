# FlyTrack - AeroPuerto Smart

Sistema de gestión de vuelos del aeropuerto AeroPuerto Smart.

## Tech Stack

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **Frontend**: Angular 21
- **Docker**: Docker Compose
- **CI/CD**: GitHub Actions

## Estructura del Proyecto

```
├── backend/           # API REST con FastAPI
├── frontend/          # Aplicación Angular
├── docker-compose.yml # Desarrollo local
└── .github/workflows/ # Pipeline CI/CD
```

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
```

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/flights/` | Listar vuelos |
| POST | `/api/flights/` | Crear vuelo (auth) |
| GET | `/api/luggage/` | Reportes de equipaje |
| POST | `/api/luggage/` | Crear reporte |

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