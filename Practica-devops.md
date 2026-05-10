**Práctica DevOps: AeroPuerto Smart**

**AeroPuerto Smart** es un aeropuerto regional que ha decidido modernizar sus procesos tecnológicos para mejorar la experiencia de los pasajeros y optimizar la operación aérea. Recientemente se desarrolló una aplicación web llamada **FlyTrack**, que permite a los pasajeros consultar itinerarios, recibir notificaciones sobre cambios de vuelo, conocer la puerta de embarque y reportar inconvenientes con su equipaje.

Sin embargo, el equipo de desarrollo enfrenta varios problemas:

* Las actualizaciones toman días en llegar al sistema en producción.

* Cada despliegue genera fallos inesperados en módulos críticos.

* No hay un control adecuado de versiones ni pruebas automatizadas.

* La infraestructura se configura manualmente y casi no está documentada.

* La comunicación entre desarrolladores, personal de soporte y operaciones es limitada..

La administración del aeropuerto quiere implementar DevOps para mejorar la estabilidad, velocidad y calidad del software, pero no tiene claro por dónde empezar.

#### **Fase 1: Investigación y diagnóstico**

1. ¿Qué es DevOps y por qué es importante?  
2. ¿Qué problemas actuales puede resolver DevOps en el caso de AeroPuerto Smart?  
3. Elaborar un diagnóstico del flujo actual de desarrollo y despliegue (simulado).  
4. Identificar herramientas y prácticas clave para mejorar el ciclo de vida del software.

**Fase 2: Diseño del pipeline DevOps**

5. Diseñar un pipeline de CI/CD (Continuous Integration / Continuous Deployment) básico para **FlyTrack**.  
6. Incluir etapas como: compilación, pruebas automatizadas, análisis de calidad, despliegue automático a staging/producción.  
7. Sugerir herramientas apropiadas: Git, GitHub Actions/GitLab CI/Jenkins, Docker, Kubernetes, SonarQube, etc.

**Fase 3: Implementación práctica (mínima viable)**

8. Crear un repositorio con control de versiones.  
9. Automatizar pruebas unitarias con un framework.  
10. Usar contenedores para empaquetar la aplicación.  
11. Automatizar el despliegue a un entorno controlado (por ejemplo, con GitHub Actions y Docker Compose en una VM o servicio en la nube).

**Fase 4: Informe y presentación**

12. Elaborar un informe técnico donde se explique el diagnóstico, las decisiones tomadas y las herramientas utilizadas.  
13. Exponer en clase el funcionamiento del pipeline, las ventajas de DevOps y las lecciones aprendidas.