---
name: corrector-postura-campana-fase1
description: Campaña Fase 1 del Corrector de Postura Smart lanzada 2026-06-01 — estructura ABO, creativos Hook A/B, árbol de decisiones, pixel ID pendiente
metadata:
  type: project
---

Campaña ABO de validación creada para Corrector de Postura Smart el 2026-06-01.

**Why:** Segundo producto testeado en Meta Ads. Primer testeo de producto en categoría postura/ergonomía. Sin historial de campaña previo para este SKU.

**How to apply:** Al recibir datos del Día 1, aplicar árbol de decisión Fase 1. Solicitar siempre TC y TE reales de Dropi antes de decidir escalar. Recordar que Hook C (9:16) está reservado para Día 3 si CPA es bueno ($1.000–$3.500).

## Datos del producto al lanzar

- Precio de venta: $34.990 CLP (precio tachado $49.990)
- Costo Dropi: desconocido (pendiente costeo con agente Cloe)
- ID Dropi: 126965 | Proveedor: Importza
- Modelo: COD, envío gratis a todo Chile
- Landing: Construida en HTML, pendiente subir a Shopify

## Estructura de campaña

- Nombre campaña: `PM | Corrector Postura Smart | ABO | Validacion | 01-06-26`
- Campaign ID: 120242984875300424
- Ad Account ID: 3619468424820755
- Estado campaña: PAUSADO
- Objetivo: OUTCOME_SALES / OFFSITE_CONVERSIONS / evento PURCHASE
- Presupuesto total: $10.000 CLP/día (2 ad sets × $5.000)

### Ad Set 1 — Hook A
- Nombre: `PM | Postura | Hook A - Dolor Teletrabajo | Broad | Chile`
- Presupuesto diario: $5.000 CLP (500.000 centavos)
- Targeting: Broad, Chile, todos los géneros, Advantage+ Audience
- Creativo: Hook A — "¿Tu espalda paga el precio del teletrabajo?" (Feed 1:1)
- URL Canva: https://www.canva.com/d/qI54ShtAGPbY6Go
- Framework: PAS — Ángulo dolor laboral/teletrabajo (cold traffic broad)
- Ad Set ID: 120242985012350424
- Ad ID: 120242985091250424
- Estado: PAUSADO (creado 2026-06-01, creativo placeholder activo)

### Ad Set 2 — Hook B
- Nombre: `PM | Postura | Hook B - Sin Esfuerzo | Broad | Chile`
- Presupuesto diario: $5.000 CLP (500.000 centavos)
- Targeting: Broad, Chile, todos los géneros, Advantage+ Audience
- Creativo: Hook B — "Postura perfecta en el trabajo. Sin esfuerzo." (Feed 1:1)
- URL Canva: https://www.canva.com/d/gwbv2yd6fz54JRP
- Framework: BAB — Ángulo beneficio sin esfuerzo (complementa Hook A)
- Ad Set ID: 120242985013350424
- Ad ID: 120242985092690424
- Estado: PAUSADO (creado 2026-06-01, creativo placeholder activo)

### Creativo reservado Día 3
- Hook C: "Horas frente a la pantalla están destruyendo tu espalda" (Story/Reels 9:16)
- URL Canva: https://www.canva.com/d/G1wI4nkSvlivcwr
- Activar solo si CPA Día 1-2 está en rango bueno ($1.000–$3.500 CLP)

## IDs completos de la campaña (todos PAUSADOS)

| Entidad | Nombre | ID |
|---|---|---|
| Campaña | PM | Corrector Postura Smart | ABO | Validacion | 01-06-26 | 120242984875300424 |
| Ad Set 1 | PM | Postura | Hook A - Dolor Teletrabajo | Broad | Chile | 120242985012350424 |
| Ad Set 2 | PM | Postura | Hook B - Sin Esfuerzo | Broad | Chile | 120242985013350424 |
| Anuncio 1 | PM | Postura | Hook A - Dolor Teletrabajo | 1:1 | Placeholder | 120242985091250424 |
| Anuncio 2 | PM | Postura | Hook B - Sin Esfuerzo | 1:1 | Placeholder | 120242985092690424 |

- **Pixel real:** 2568616300179365 (nombre: "Pixel Punto mercado") — activo, último evento 2026-06-01
- **Ad Account ID:** 3619468424820755 (distinto al pixel — no confundir)
- **Page ID:** 860239420515895

## Pendientes críticos antes de activar

1. **URL landing Shopify** — pendiente subir el HTML del Corrector de Postura a Shopify. URL actual: placeholder `https://puntomercado.cl`
2. **Creativos reales** — Hook A y Hook B deben exportarse en 1:1 (1080×1080) desde Canva, subirse a Meta Ads Manager, y reemplazar la imagen placeholder en cada anuncio.
3. **Actualizar URL del anuncio** — una vez que la landing esté en Shopify, editar ambos anuncios con la URL real del producto.

## Competencia y diferenciación

- 6+ anunciantes activos en Meta Ads Library Chile con producto similar
- Competidores usan "Corrige Postura" directamente
- Punto Mercado usa lenguaje honesto: "ayuda a mantener", "favorece", "contribuye a"
- Diferenciación: ángulo teletrabajo/pantalla + discreción bajo la ropa

## Tasa de concreción estimada

Usando promedios históricos: TC=0.65, TE=0.77 → tasa real ~0.50
CPA real = CPA Meta / 0.50. Solicitar datos Dropi reales tras los primeros días.

## Árbol de decisiones Fase 1

- 0 ventas al fin del Día 1 → APAGAR
- 1 venta → esperar hasta 13:00 Día 2; sin venta adicional → APAGAR; con venta → evaluar como 2+
- 2+ ventas → evaluar CPA promedio al fin del Día 2:
  - CPA > $6.000 → APAGAR
  - CPA $4.000–$5.999 → dejar 1 día más sin cambios
  - CPA $1.000–$3.500 → lanzar Hook C + nuevo creativo en Día 3
