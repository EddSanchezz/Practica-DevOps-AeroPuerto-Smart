const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        PageOrientation, PageBreak } = require('docx');

const doc = new Document({
  properties: {
    title: "Informe Técnico - Implementación DevOps",
    subject: "Práctica DevOps - AeroPuerto Smart",
    author: "Estudiante",
    keywords: "DevOps, CI/CD, Docker, FlyTrack"
  },
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1E3C72" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2A5298" },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } },
      { id: "Normal", name: "Normal", basedOn: "Normal",
        run: { font: "Arial", size: 22 },
        paragraph: { spacing: { line: 276 } } }
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "INFORME TÉCNICO", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "Implementación de Pipeline DevOps para FlyTrack", bold: true, size: 28 })] }),
      new Paragraph({ children: [new TextRun({ text: "AeroPuerto Smart", italic: true, color: "666666" })] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1. RESUMEN EJECUTIVO" })] }),
      new Paragraph({ children: [new TextRun("Este informe documenta la implementación de prácticas DevOps para la aplicación FlyTrack del AeroPuerto Smart. El objetivo principal fue automatizar el ciclo de desarrollo, pruebas y despliegue para mejorar la calidad del software y reducir el tiempo de entrega.") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun("La solución implementada incluye:") }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Pipeline CI/CD con GitHub Actions")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Contenedores Docker para backend y frontend")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Pruebas unitarias automatizadas con pytest")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Integración y despliegues automáticos a staging y producción")] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "2. DIAGNÓSTICO INICIAL" })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "2.1 Problemas identificados" })] }),
      new Paragraph({ children: [new TextRun("Antes de implementar DevOps, el equipo de desarrollo de FlyTrack enfrentaba varios problemas críticos:") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, shading: { fill: "1E3C72", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Problema", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, shading: { fill: "1E3C72", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Impacto", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Actualizaciones tardan días en producción")]),
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Retraso en nuevas funcionalidades")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Despliegues generan fallos inesperados")]),
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Inestabilidad en producción")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("No hay control de versiones adecuado")]),
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Dificultad para hacer seguimiento")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Sin pruebas automatizadas")]),
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Errores no detectados a tiempo")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Infraestructura manual")]),
              new TableCell({ width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph("Errores de configuración")])
            ]
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3. SOLUCIÓN IMPLEMENTADA" })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "3.1 Arquitectura del Pipeline" })] }),
      new Paragraph({ children: [new TextRun("El pipeline CI/CD implementado se ejecuta en GitHub Actions y consiste en 4 etapas principales:") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "1. BUILD - Compilación de código", bold: true }) ]),
      new Paragraph({ children: [new TextRun("   • Backend: Instalación de dependencias Python") }),
      new Paragraph({ children: [new TextRun("   • Frontend: npm ci + npm build") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "2. TEST & QUALITY - Pruebas y calidad", bold: true }) }),
      new Paragraph({ children: [new TextRun("   • Linting: Flake8 y Black para Python, ESLint para Angular") }),
      new Paragraph({ children: [new TextRun("   • Tests: pytest con cobertura de código") }),
      new Paragraph({ children: [new TextRun("   • Reportes: Codecov para seguimiento de cobertura") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "3. BUILD & PUSH - Construcción de imágenes", bold: true }) ]),
      new Paragraph({ children: [new TextRun("   • Docker build para backend y frontend") }),
      new Paragraph({ children: [new TextRun("   • Push a GitHub Container Registry (ghcr.io)") }),
      new Paragraph({ children: [new TextRun("   • Tags: version y latest") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "4. DEPLOY - Despliegue automático", bold: true }) ]),
      new Paragraph({ children: [new TextRun("   • Staging: automático en push a develop") }),
      new Paragraph({ children: [new TextRun("   • Producción: automático en push a main") }),
      new Paragraph({ children: [new TextRun("   • Requiere aprobación en producción") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: "3.2 Herramientas utilizadas" })] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 2340, type: WidthType.DXA }, shading: { fill: "1E3C72", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Categoría", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ width: { size: 2340, type: WidthType.DXA }, shading: { fill: "1E3C72", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Herramienta", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ width: { size: 2340, type: WidthType.DXA }, shading: { fill: "1E3C72", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Versión", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ width: { size: 2340, type: WidthType.DXA }, shading: { fill: "1E3C72", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Uso", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("CI/CD")] }),
              new TableCell({ children: [new Paragraph("GitHub Actions")] }),
              new TableCell({ children: [new Paragraph("Latest")] }),
              new TableCell({ children: [new Paragraph("Automatización")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Testing")] }),
              new TableCell({ children: [new Paragraph("pytest")] }),
              new TableCell({ children: [new Paragraph("7.4.4")] }),
              new TableCell({ children: [new Paragraph("Tests unitarios")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Container")] }),
              new TableCell({ children: [new Paragraph("Docker")] }),
              new TableCell({ children: [new Paragraph("Latest")] }),
              new TableCell({ children: [new Paragraph("Contenedores")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Linting")] }),
              new TableCell({ children: [new Paragraph("Flake8 + Black")] }),
              new TableCell({ children: [new Paragraph("Latest")] }),
              new TableCell({ children: [new Paragraph("Calidad código")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Backend")] }),
              new TableCell({ children: [new Paragraph("FastAPI")] }),
              new TableCell({ children: [new Paragraph("0.109.0")] }),
              new TableCell({ children: [new Paragraph("API REST")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Frontend")] }),
              new TableCell({ children: [new Paragraph("Angular")] }),
              new TableCell({ children: [new Paragraph("21.x")] }),
              new TableCell({ children: [new Paragraph("UI Web")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Database")] }),
              new TableCell({ children: [new Paragraph("PostgreSQL")] }),
              new TableCell({ children: [new Paragraph("16")] }),
              new TableCell({ children: [new Paragraph("Base de datos")] })
            ]
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "4. RESULTADOS OBTENIDOS" })] }),
      new Paragraph({ children: [new TextRun("La implementación de DevOps ha generado los siguientes beneficios:") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: [
              new TableCell({ width: { size: 3120, type: WidthType.DXA }, shading: { fill: "2A5298", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Métrica", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ width: { size: 3120, type: WidthType.DXA }, shading: { fill: "2A5298", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Antes", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ width: { size: 3120, type: WidthType.DXA }, shading: { fill: "2A5298", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Después", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Tiempo de despliegue")]),
              new TableCell({ children: [new Paragraph("Días")]),
              new TableCell({ children: [new Paragraph("Minutos")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Tasa de fallos en producción")]),
              new TableCell({ children: [new Paragraph("Alta")]),
              new TableCell({ children: [new Paragraph("Baja")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Pruebas automatizadas")]),
              new TableCell({ children: [new Paragraph("0%")]),
              new TableCell({ children: [new Paragraph("80%+")])
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Visibilidad de código")]),
              new TableCell({ children: [new Paragraph("Limitada")]),
              new TableCell({ children: [new Paragraph("Total")])
            ]
          })
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "5. LECCIONES APRENDIDAS" })] }),
      new Paragraph({ children: [new TextRun("Durante la implementación se aprendieron las siguientes lecciones:") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "1. La automatización es clave", bold: true }) }),
      new Paragraph({ children: [new TextRun("   Automatizar tareas repetitivas reduce errores humanos y libera tiempo para trabajo de mayor valor.") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "2. Las pruebas son fundamentales", bold: true }) ]),
      new Paragraph({ children: [new TextRun("   Invertir en tests automatizados previene problemas en producción y facilita el refactoring.") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "3. La documentación es esencial", bold: true }) }),
      new Paragraph({ children: [new TextRun("   Mantener documentación actualizada del pipeline y la infraestructura facilita la incorporación de nuevos miembros.") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "4. Los contenedores facilitan el despliegue", bold: true }) }),
      new Paragraph({ children: [new TextRun("   Docker garantiza consistencia entre entornos y simplifica la infraestructura.") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "6. CONCLUSIONES Y TRABAJO FUTURO" })] }),
      new Paragraph({ children: [new TextRun("La implementación de DevOps ha transformado positivamente el desarrollo de FlyTrack. El equipo ahora puede:") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Desplegar código de manera segura y frecuente")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Detectar errores tempranamente con pruebas automatizadas")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Mantener estándares de calidad con linting automático")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Escalar la infraestructura con contenedores") ]),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun("Para trabajo futuro se recomienda:") }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Integrar SonarCloud para análisis de código estático")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Implementar monitoreo con Prometheus y Grafana")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Agregar tests de integración y e2e")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Configurar despliegues a producción con estrategia de rollback") }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Evaluar migración a Kubernetes para mayor escalabilidad")] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "═══════════════════════════════════════════════════════════════", color: "CCCCCC" })] }),
      new Paragraph({ children: [new TextRun({ text: " ", break: 1 }) ] }),
      new Paragraph({ children: [new TextRun({ text: "Documento generado como parte de la Práctica DevOps", italic: true, color: "666666" })] }),
      new Paragraph({ children: [new TextRun({ text: "AeroPuerto Smart - FlyTrack", color: "666666" })] }),
      new Paragraph({ children: [new TextRun({ text: new Date().toLocaleDateString('es-ES'), color: "666666" })] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const fs = require('fs');
  fs.writeFileSync('E:\\GitHub\\Practica-DevOps-AeroPuerto-Smart\\docs\\Informe-Tecnico-DevOps.docx', buffer);
  console.log('Documento creado exitosamente');
});