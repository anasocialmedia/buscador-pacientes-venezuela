# Dashboard Punto Mercado — Guía de Configuración en Notion
> Estética: pastel aesthetic / lavanda + mint + rose · Adaptado al pipeline de dropshipping COD

---

## Vista general del layout

```
┌──────────────────────────────────────────────────────────────────┐
│  🛒  Punto Mercado                          [fecha]   [KPI día]  │
├────────────┬─────────────────────────────┬───────────────────────┤
│ NAVEGACIÓN │      PRODUCTOS ACTIVOS      │  PRIORIDADES DEL DÍA  │
│            │     (Gallery View)          │  □ Confirmar órdenes  │
│ Investigar │  [Foto] [Foto] [Foto]       │  □ Revisar Meta Ads   │
│ Costeo     │                             │  □ Publicar landing   │
│ Landing    ├─────────────────────────────┤  □ Emitir boletas     │
│ Anuncios   │     PIPELINE ACTIVO         ├───────────────────────┤
│ Campaña    │  (Board: Investigar→Activo) │   KPIs DE HOY         │
│ Órdenes    │                             │  TC: ___  TE: ___     │
│ Tributario ├─────────────────────────────┤  CPA: ___  Ventas:___ │
│            │   ÓRDENES RECIENTES         ├───────────────────────┤
│ brain dump │   (Table: últimas 10)       │   MEALS / NOTAS       │
│            │                             │   (free text)         │
└────────────┴─────────────────────────────┴───────────────────────┘
```

---

## 1. Paleta de colores en Notion

Notion usa colores nombrados. Esta es la asignación por sección:

| Sección | Color de fondo Notion | Color de texto |
|---|---|---|
| Header / título | **Purple background** | White |
| Investigar | **Pink background** | Pink |
| Costeo | **Green background** | Green |
| Landing | **Yellow background** | Yellow |
| Anuncios | **Orange background** | Orange |
| Campaña | **Purple background** | Purple |
| Órdenes | **Blue background** | Blue |
| Tributario | **Gray background** | Gray |
| Brain dump | **Brown background** | Brown |

> Para aplicar: selecciona el bloque → clic en `⋮⋮` → `Color` → elige el color de fondo indicado.

---

## 2. Estructura página por página

### 📌 PÁGINA PRINCIPAL — "Dashboard"

**Encabezado:**
- Título: `🛒 Punto Mercado` — tamaño Heading 1, color **Purple**
- Subtítulo: `Dropshipping COD · Chile` — color Gray

**Columnas (usar `/columns`):** 3 columnas — 25% / 50% / 25%

---

### COLUMNA IZQUIERDA — Navegación

Crea bloques de texto con fondo de color y emoji. Cada uno es un link a su sub-página.

```
🔍 Investigar          ← fondo Pink
💰 Costeo              ← fondo Green
📄 Landing             ← fondo Yellow
📢 Anuncios            ← fondo Orange
📊 Campaña             ← fondo Purple
📦 Órdenes COD         ← fondo Blue
🧾 Tributario          ← fondo Gray
---
💡 Brain Dump          ← fondo Brown
```

**Cómo crear cada botón:**
1. `/text` → escribe el emoji + nombre
2. Selecciona el texto → `⋮⋮` → Color → elige fondo
3. Convierte en **link a página** arrastrando o con `@nombre-de-página`

---

### COLUMNA CENTRAL — Contenido principal (2 secciones)

#### Sección A: Productos (Gallery View)

1. Crea una **base de datos inline** (`/database`)
2. Vista: **Gallery** (tarjetas con imagen)
3. Propiedades de la base de datos:

| Propiedad | Tipo | Valores |
|---|---|---|
| Nombre | Title | — |
| Estado | Select | 🔬 Testing / ✅ Activo / 🔴 Descartado / 📦 Archivado |
| Precio Venta | Number | CLP |
| Costo Dropi | Number | CLP |
| ID Dropi | Text | — |
| Margen Neto | Formula | `(prop("Precio Venta") - prop("Costo Dropi")) / prop("Precio Venta")` |
| CPA Techo | Number | CLP |
| Proveedor | Select | Meibo / Importza / Tendenza / Diamac / Tao / Otro |
| Cover | Files | Imagen de portada |

4. **Filtrar** por Estado = "Activo" o "Testing"
5. Activar **imagen de portada** en propiedades de la galería
6. Título de la sección: `📦 Productos` — fondo **Purple background**

#### Sección B: Pipeline de Órdenes (Tabla)

1. Nueva base de datos inline
2. Vista: **Table**
3. Propiedades:

| Propiedad | Tipo | Notas |
|---|---|---|
| Orden # | Title | — |
| Producto | Relation | → base de Productos |
| Cliente | Text | — |
| Estado | Select | 🆕 Nueva / ✅ Confirmada / 📦 Enviada / ✅ Entregada / ❌ Rechazada |
| Fecha | Date | — |
| Total | Number | CLP |
| Dirección verificada | Checkbox | Google Maps |
| WhatsApp enviado | Checkbox | — |

---

### COLUMNA DERECHA — Prioridades + KPIs

#### Bloque 1: Prioridades del día

- Título: `✅ Prioridades del día` — fondo **Pink background**
- Usa `/todo` para agregar checkboxes
- Checkboxes sugeridos:
  ```
  □ Confirmar órdenes nuevas (WhatsApp)
  □ Revisar CPA en Meta Ads
  □ Verificar stock en Dropi
  □ Emitir boletas SII
  □ Revisar entregadas/rechazadas
  ```
- Borra y recrea cada mañana (o usa una sub-página de tareas recurrentes)

#### Bloque 2: KPIs del día

- Título: `📈 KPIs de hoy` — fondo **Green background**
- Crea una tabla simple (`/simple table`) 2×4:

```
| Métrica      | Valor |
|---|---|
| TC (%)        |       |
| TE (%)        |       |
| CPA Real      |       |
| Ventas hoy    |       |
```

- Actualiza manualmente desde Drofit cada tarde

#### Bloque 3: Notas / Brain Dump

- Título: `💡 Brain Dump` — fondo **Brown background**
- Deja un bloque de texto libre para ideas de productos, observaciones de campaña, etc.

---

## 3. Sub-páginas del pipeline

Crea una sub-página por cada etapa. Cada una sigue la misma estética pero con su color.

### 🔍 Investigar (Pink)

Contenido:
- Checklist de criterios de selección de producto
- Tabla de candidatos con: Nombre / Precio / Señales Meta Ads / Veredicto
- Link directo: `app.dropi.cl` y `facebook.com/ads/library`

### 💰 Costeo (Green)

Contenido:
- Template de costeo (tabla con fórmulas manuales)
- Historial de productos testeados (copiado del contexto)
- Umbrales de decisión (CPA techo, CPA objetivo)

### 📄 Landing (Yellow)

Contenido:
- Checklist de secciones de landing (Hero/Problema/Solución/Beneficios/CTA)
- Notas técnicas Shopify
- Link a Shopify Admin

### 📢 Anuncios (Orange)

Contenido:
- Frameworks PAS / BAB / AIDA / 4P (copiados del contexto)
- Hook bank (lista de hooks que han funcionado)
- Creativos activos con link a Meta Ads

### 📊 Campaña (Purple)

Contenido:
- Árbol de decisiones Fase 1 y Fase 2
- Tracker de campaña: Día / Gasto / Compras / CPA
- Semáforo: ✅ Bueno / 🟡 Validando / 🔴 Apagar

### 📦 Órdenes COD (Blue)

Contenido:
- Template WhatsApp (para copiar y pegar)
- Checklist de confirmación: verificar dirección → WhatsApp → confirmar en Realisit
- Resumen semanal: órdenes / confirmadas / entregadas / rechazadas

### 🧾 Tributario (Gray)

Contenido:
- Resumen de obligaciones (boletas, IVA, PPM)
- Calendario tributario (días 20 de cada mes)
- Preguntas frecuentes del agente tributario

---

## 4. Estética visual — tips adicionales

### Íconos de página
Usa emojis como íconos de cada sub-página para reforzar el color:
- 🔍 Investigar · 💰 Costeo · 📄 Landing · 📢 Anuncios · 📊 Campaña · 📦 Órdenes · 🧾 Tributario

### Cover de página principal
- Ve a la página Dashboard → `Add cover`
- Elige un gradiente **purple/lavender** de Notion o sube una imagen del `_BrandKIT/`

### Fuente recomendada
- Notion Settings → `Default text` → **Serif** (se ve más aesthetic) o **Sans-serif** para más limpieza

### Dividers
Usa `/divider` entre secciones para separar visualmente sin sobrecargar.

### Callout blocks
Para información importante, usa `/callout` con el emoji y color correspondiente:
- `⚠️` + fondo Yellow → alertas de campaña
- `✅` + fondo Green → producto ganador
- `🔴` + fondo Red → apagar campaña

---

## 5. Checklist de configuración

```
□ Crear página principal "Dashboard"
□ Agregar cover morada/lavanda
□ Crear layout de 3 columnas
□ Columna izq: 8 botones de navegación con colores
□ Columna central: base de datos Productos (gallery)
□ Columna central: base de datos Órdenes (table)
□ Columna der: bloque Prioridades del día (todo list)
□ Columna der: bloque KPIs (simple table)
□ Columna der: bloque Brain Dump (text)
□ Crear 7 sub-páginas del pipeline
□ Poblar sub-páginas con contenido del contexto
□ Cambiar fuente a Serif o Sans-serif
□ Agregar íconos emoji a todas las páginas
```

---

*Guía generada para Punto Mercado · Mayo 2026*
