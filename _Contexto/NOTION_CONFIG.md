# Notion — Configuración de Integración

> Este archivo es leído por los agentes para sincronizar datos con la base de datos de productos en Notion.
> **No modificar manualmente** a menos que cambies la integración de Notion.

## Credenciales

```
NOTION_TOKEN=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
NOTION_DB_ID=36ffc94d-b1af-8106-9ad4-c7a897a91be6
NOTION_API_VERSION=2022-06-28
```

## Base de datos: Productos — Punto Mercado

URL: https://www.notion.so/36ffc94db1af81069ad4c7a897a91be6

## Campos disponibles

| Campo | Tipo | Valores posibles |
|---|---|---|
| Nombre | title | Nombre del producto |
| Estado Pipeline | select | 🔍 Investigando / 💰 Costeando / 🖥️ Landing / ✍️ Copy / Anuncios / 🚀 Campaña Activa / ✅ Activo / ⏸️ Pausado / 🔴 Descartado |
| Veredicto | select | ✅ VIABLE / 🟡 AJUSTAR / 🔴 DESCARTAR / ⏳ Pendiente |
| Proveedor | select | Meibo / Importza / Tendenza / Diamac / Tao / Trompila / Otro |
| ID Dropi | rich_text | ID numérico |
| Precio Venta (CLP) | number | Entero |
| Costo Dropi (CLP) | number | Entero |
| Margen Neto (%) | number | Decimal (0.103 = 10.3%) |
| CPA Estimado (CLP) | number | Entero |
| CPA Real (CLP) | number | Entero |
| Gasto Total Ads (CLP) | number | Entero |
| URL Landing | url | URL completa |
| Fecha Inicio Campaña | date | ISO 8601 (YYYY-MM-DD) |
| Notas | rich_text | Texto libre |

## Comandos de referencia

### Buscar producto por nombre
```bash
NOTION_TOKEN="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"
NOTION_DB_ID="36ffc94d-b1af-8106-9ad4-c7a897a91be6"

curl -s -X POST "https://api.notion.com/v1/databases/$NOTION_DB_ID/query" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d "{\"filter\": {\"property\": \"Nombre\", \"title\": {\"equals\": \"NOMBRE_PRODUCTO\"}}}"
```

### Actualizar registro existente (PATCH)
```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/PAGE_ID" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{"properties": { ... }}'
```

### Crear nuevo registro (POST)
```bash
curl -s -X POST "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d "{\"parent\": {\"database_id\": \"$NOTION_DB_ID\"}, \"properties\": { ... }}"
```
