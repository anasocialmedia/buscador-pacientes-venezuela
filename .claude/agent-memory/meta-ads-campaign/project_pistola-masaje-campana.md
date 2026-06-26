---
name: pistola-masaje-campana-fase1
description: Campana Fase 1 de Pistola de Masaje lanzada 2026-05-29 — estructura ABO, creativos, reglas de decision y discrepancia de precio detectada
metadata:
  type: project
---

Campana ABO de validacion lanzada para Pistola de Masaje el 2026-05-29.

**Why:** Primer testeo del producto en Meta Ads. Sin historial de campana previo para este SKU.

**How to apply:** Al recibir datos del Dia 1, aplicar arbol de decision Fase 1 del agente. Solicitar siempre TC y TE reales de Dropi antes de decidir escalar.

## Estructura de campana

- Nombre campana: `PM | Pistola Masaje | ABO | Validacion | 29-05-26`
- Nombre adset: `PM | Masaje | Broad 25-55 | Chile`
- Presupuesto diario: $8.500 CLP/dia
- Objetivo: Ventas / Conversiones (evento: Purchase)
- Audiencia: Broad, 25-55, Chile, todos los generos
- Anuncios Fase 1: 2 imagenes 1:1 (Hook A y Hook B)
- Creativos reservados Dia 3: Asset 3 (9:16) + video TTS CapCut

## Datos del producto al lanzar

- Precio de venta: $35.990 CLP (usuario) — DISCREPANCIA con contexto que dice $27.990
- Costo Dropi: $5.990 CLP
- Margen post-IVA: 8.2% (segun usuario)
- CPA maximo aceptable: $5.485 CLP
- CPA objetivo rentable: ≤ $4.000 CLP
- ID Dropi: 56201 | Proveedor: Eliphete | Bodega: Santiago

## Advertencia critica de precio

El contexto activo (§12) registra precio $27.990. El usuario indica $35.990. Si el precio real es $27.990, el margen post-IVA es negativo con CPA de $4.000. Verificar y actualizar PUNTO_MERCADO_CONTEXT.md antes de escalar.

## Tasa de concrecion estimada

Usando promedios historicos: TC=0.65, TE=0.77 → tasa real ~0.50.
CPA real = CPA Meta / 0.50. Solicitar datos Dropi reales tras los primeros dias.

## IDs en Meta Ads — Estructura reestructurada (2026-05-29)

- Ad Account ID: 3619468424820755
- Campaign ID: 120242785378650424
- Estado campana: ACTIVA (activada 2026-05-29)

### Ad Set 1 — PM | Masaje | Broad 25-55 | Chile
- Ad Set ID: 120242785404300424
- Presupuesto diario: $5.000 CLP (500.000 centavos) — actualizado desde $8.500
- Optimizacion: OFFSITE_CONVERSIONS / evento PURCHASE
- Targeting: Advantage+ Audience, Chile broad, sugerencia 25-55
- Placements: automaticos (Meta Advantage+)

| Nombre | Ad ID | Estado |
|---|---|---|
| PM \| Pistola \| Angulo 1 - Tension Laboral | 120242785903810424 | PAUSED (activo) |
| PM \| Pistola \| Angulo 2 - Sin Masajista | 120242786090900424 | DELETED |
| PM \| Pistola \| Angulo 3 - Regalo | 120242786103160424 | DELETED |

### Ad Set 2 — PM | Masaje | Broad 25-55 | Chile | Set 2
- Ad Set ID: 120242786425490424
- Presupuesto diario: $5.000 CLP (500.000 centavos)
- Optimizacion: OFFSITE_CONVERSIONS / evento PURCHASE
- Targeting: Advantage+ Audience, Chile broad
- Estado: PAUSADO

| Nombre | Ad ID | Estado |
|---|---|---|
| PM \| Pistola \| Angulo 2 - Sin Masajista | 120242786445000424 | PAUSED |

Nota: ads_create_creative no habilitado para esta cuenta. Anuncios creados con object_story_spec inline via ads_create_ad. Para asociar videos, el usuario debe editar cada anuncio en Ads Manager y subir el creativo. URL de destino es placeholder: https://puntomercado.cl — actualizar a la URL real de la landing en Shopify antes de activar.

## Estado Notion

- Registro: 36ffc94d-b1af-812f-8d40-ca93b8d4706f
- Estado actualizado a: Campana Activa
- Fecha inicio campana: 2026-05-29
