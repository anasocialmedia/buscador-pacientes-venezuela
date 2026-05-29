# Google Drive — Configuración de Integración

> Este archivo es leído por los agentes para guardar reportes en Google Drive.
> Cuenta conectada: puntomercadocl@gmail.com

## Carpetas

```
DRIVE_FOLDER_ROOT_ID=1XxR_HbFNATB7dJ3P0pZWHMoOySw4X9fw
DRIVE_FOLDER_REPORTES_ID=1OfOL867fXFNlwhiVy6xOsda74k_P617I
```

| Carpeta | ID | URL |
|---|---|---|
| Punto Mercado (raíz) | `1XxR_HbFNATB7dJ3P0pZWHMoOySw4X9fw` | https://drive.google.com/drive/folders/1XxR_HbFNATB7dJ3P0pZWHMoOySw4X9fw |
| Reportes Mensuales | `1OfOL867fXFNlwhiVy6xOsda74k_P617I` | https://drive.google.com/drive/folders/1OfOL867fXFNlwhiVy6xOsda74k_P617I |

## Cómo subir un reporte (MCP Tool)

El agente usa el tool `mcp__claude_ai_Google_Drive__create_file` directamente:

```
Tool: mcp__claude_ai_Google_Drive__create_file
Parámetros:
  title: "Reporte Punto Mercado — Mayo 2026"
  parentId: "1OfOL867fXFNlwhiVy6xOsda74k_P617I"
  textContent: [contenido completo del reporte en markdown]
  contentMimeType: "text/plain"
  disableConversionToGoogleType: false   ← se convierte a Google Doc automáticamente
```

El resultado es un Google Doc que el usuario puede ver en Drive sin gastar tokens adicionales.

## Nota importante

La conexión con Google Drive requiere que el usuario haya autenticado la integración MCP en la sesión actual (`/mcp` → claude.ai Google Drive). Si la integración no está activa, el agente debe avisar al usuario y entregar el reporte en el chat como fallback.
