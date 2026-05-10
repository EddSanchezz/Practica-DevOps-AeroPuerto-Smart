# Fase 2: Diseño del Pipeline DevOps

## 5. Pipeline CI/CD para FlyTrack

### Arquitectura del Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GIT REPOSITORY                                  │
│                   (GitHub - main/develop)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EVENTO: PUSH / PR                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         STAGE 1: BUILD                                   │
│                    Compilación de código                                │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐     │
│  │   Backend (Python)       │  │      Frontend (Angular)         │     │
│  │   - pip install          │  │      - npm ci                   │     │
│  │   - dependency check     │  │      - npm install               │     │
│  └──────────────────────────┘  └──────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STAGE 2: TEST & QUALITY                              │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐     │
│  │   Linting                │  │      Unit Tests                 │     │
│  │   - Flake8 (Python)      │  │      - pytest (Backend)         │     │
│  │   - Black (format)       │  │      - npm run test (Frontend)   │     │
│  │   - ESLint (JS/TS)       │  │      - Coverage > 80%            │     │
│  └──────────────────────────┘  └──────────────────────────────────┘     │
│                                    │                                     │
│                                    ▼                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐     │
│  │   Security Scan         │  │      Coverage Report              │     │
│  │   - Dependency check    │  │      - Codecov                   │     │
│  │   - vulnerabilities     │  │      - Artifact upload           │     │
│  └──────────────────────────┘  └──────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STAGE 3: BUILD & PUSH                                │
│                  (Solo en push a main/develop)                          │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐     │
│  │   Backend Docker Image  │  │      Frontend Docker Image       │     │
│  │   - build & push        │  │      - build & push              │     │
│  │   - ghcr.io/repo/backend│  │      - ghcr.io/repo/frontend     │     │
│  │   - tag: version/latest│  │      - tag: version/latest       │     │
│  └──────────────────────────┘  └──────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    STAGE 4: DEPLOY (PRODUCTION)                         │
│               (Solo en push a main - Protected Branch)                 │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐     │
│  │   Staging Environment   │  │      Production Environment      │     │
│  │   - Docker Compose      │  │      - Railway/Render/CloudRun   │     │
│  │   - PR/feature branches│  │      - Auto-deploy on main       │     │
│  └──────────────────────────┘  └──────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Etapas detalladas del Pipeline

### Etapa 1: Compilación (Build)

#### Backend (Python/FastAPI)
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend (Angular)
```bash
cd frontend
npm ci
npm run build
```

**Objetivo**: Verificar que el código compila correctamente sin errores de sintaxis o dependencias faltantes.

---

### Etapa 2: Pruebas Automatizadas y Calidad

#### Linting - Backend
```bash
# Verificar estilo de código
flake8 app/ --max-line-length=120 --ignore=E501,W503

# Verificar formateo
black --check app/
```

#### Testing - Backend
```bash
# Ejecutar tests con cobertura
pytest tests/ --cov=app --cov-report=xml --cov-report=html

# Subir reporte a Codecov
codecov --file=./coverage.xml
```

#### Testing - Frontend
```bash
cd frontend
npm run lint
npm run build
```

**Objetivo**: Garantizar que el código cumple estándares de calidad y pasa todas las pruebas unitarias antes de avanzar.

---

### Etapa 3: Construcción y Push de Imágenes

```yaml
# Build y push a GitHub Container Registry
docker build -t ghcr.io/user/repo/backend:$VERSION .
docker push ghcr.io/user/repo/backend:$VERSION
docker push ghcr.io/user/repo/backend:latest

docker build -t ghcr.io/user/repo/frontend:$VERSION .
docker push ghcr.io/user/repo/frontend:$VERSION
docker push ghcr.io/user/repo/frontend:latest
```

**Objetivo**: Crear imágenes Docker reproducibles y almacenarlas en un registry privado.

---

### Etapa 4: Despliegue Automático

#### Entorno de Staging
- Se desplega automáticamente en cada push a `develop`
- URL: `https://staging.flytrack.example.com`
- Entorno de pruebas para el equipo

#### Entorno de Producción
- Se desplega automáticamente en cada push a `main`
- URL: `https://flytrack.example.com`
- Require approvals en GitHub Actions
- Rollback disponible

---

## 7. Herramientas sugeridas

### Control de Versiones
| Herramienta | Uso | Costo |
|------------|-----|-------|
| **Git** | Control de versiones | Gratuito |
| **GitHub** | Alojamiento de repositorio | Gratuito (plan básico) |

### CI/CD
| Herramienta | Uso | Costo |
|------------|-----|-------|
| **GitHub Actions** | Automatización del pipeline | Minutes gratuitas |
| **Jenkins** | CI/CD tradicional | Gratuito (self-hosted) |
| **GitLab CI** | CI/CD integrado a GitLab | Versión gratuita |

### Contenedores
| Herramienta | Uso | Costo |
|------------|-----|-------|
| **Docker** | Containerización | Gratuito |
| **Docker Compose** | Orquestación local | Gratuito |
| **GitHub Container Registry** | Registry de imágenes | Gratuito |

### Testing
| Herramienta | Uso | Costo |
|------------|-----|-------|
| **pytest** | Testing Python | Gratuito |
| **Jest** | Testing JavaScript | Gratuito |
| **Codecov** | Cobertura de código | Gratuito |

### Calidad de Código
| Herramienta | Uso | Costo |
|------------|-----|-------|
| **Flake8** | Linting Python | Gratuito |
| **Black** | Formateo Python | Gratuito |
| **ESLint** | Linting JavaScript | Gratuito |
| **SonarCloud** | Análisis estático | Gratuito (open source) |

### Despliegue
| Herramienta | Uso | Costo |
|------------|-----|-------|
| **Railway** | Deploy moderno | Plan gratuito |
| **Render** | Web services | Plan gratuito |
| **Google Cloud Run** | Contenedores | Tier gratuito |

---

## Decisiones de Diseño

### 1. GitHub Actions como CI/CD
**Razón**: Integración nativa con GitHub, fácil configuración, minutos gratuitos suficientes para proyectos pequeños.

### 2. GitHub Container Registry
**Razón**: Integrado con Actions, almacenamiento gratuito para imágenes públicas, credenciales automáticas.

### 3. pytest para Testing Backend
**Razón**: Estándar de la industria para Python, plugins extendidos (coverage, async), comunidad activa.

### 4. Docker Compose para Desarrollo
**Razón**: Simplicidad para levanta múltiples servicios (backend, frontend, DB), reproducible, kurro.

### 5. Railway para Producción
**Razón**: Despliegue simple desde Docker, escala automática, plan gratuito generoso, buena integración con GitHub.

---

## Pipeline Actual de FlyTrack

El proyecto ya cuenta con un pipeline CI/CD configurado en `.github/workflows/ci-cd.yml` que implementa:

1. **Lint & Test Backend**: Flake8, Black, pytest con coverage
2. **Lint & Test Frontend**: npm lint, npm build
3. **Build & Push**: Docker images a ghcr.io
4. **Deploy**: Script de despliegue para producción

**Próximas mejoras sugeridas**:
- Agregar SonarCloud para análisis de código
- Implementar despliegues automáticos a Railway
- Agregar tests de integración
- Implementar rollback automático
- Agregar monitoreo (Prometheus + Grafana)