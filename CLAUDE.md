# CLAUDE.md — Punto Mercado

Instrucciones de arquitectura para todos los agentes e IA de este proyecto.

---

## 1. Identidad y Voz de Marca

Toda tarea que implique copy, naming, tone-of-voice o presentación de producto **debe comenzar leyendo**:

```
_Contexto/PUNTO_MERCADO_CONTEXT.md
```

No se puede asumir ni recordar el tono de marca de sesiones anteriores. Leer siempre el archivo fuente antes de generar cualquier contenido orientado al cliente.

---

## 2. Agnosticismo de Marca (No Hardcoding)

**Prohibido** escribir en skills, prompts o agentes:
- Nombres de marca, taglines o slogans específicos
- Colores, prefijos CSS o estilos visuales específicos
- Precios, IDs de productos o datos de proveedores
- Textos de WhatsApp, CTAs o copies de anuncios

Estos valores **solo pueden aparecer** en los archivos de `_Contexto/`. Los agentes los leen; no los almacenan.

---

## 3. Inyección Dinámica de Contexto

El contexto de marca y negocio se extrae en tiempo de ejecución, no se hardcodea.

### Archivos fuente de verdad

| Archivo | Cuándo leerlo |
|---|---|
| `_Contexto/PUNTO_MERCADO_CONTEXT.md` | Siempre que la tarea involucre producto, copy, landing, campaña u órdenes |
| `_Contexto/2025_SII_TRIBUTARIO_CONTEXT.md` | Siempre que la tarea involucre precios, márgenes, IVA o tributación |

### Regla de extracción

Antes de ejecutar cualquier tarea, el agente debe leer el archivo relevante y extraer solo los campos que necesita para esa tarea. No cargar todo el contexto si no es necesario.

---

## 4. Arquitectura de Agentes

Cada agente tiene un **rol único y delimitado**. Un agente no hace el trabajo de otro.

| Agente | Responsabilidad única | Lee de |
|---|---|---|
| **Investigación** | Evaluar viabilidad de producto (señales de mercado, criterios de selección) | `PUNTO_MERCADO_CONTEXT.md` §4 |
| **Costeo** | Calcular margen neto, CPA máximo, impacto IVA | `PUNTO_MERCADO_CONTEXT.md` §5 + `SII_TRIBUTARIO_CONTEXT.md` §6 |
| **Landing** | Generar HTML inline para Shopify siguiendo specs técnicas | `PUNTO_MERCADO_CONTEXT.md` §6 |
| **Copy/Anuncios** | Generar hooks, copy de anuncio y variantes de ángulo | `PUNTO_MERCADO_CONTEXT.md` §7 |
| **Campaña** | Definir estructura ABO/CBO y árbol de decisiones | `PUNTO_MERCADO_CONTEXT.md` §8 |
| **Órdenes COD** | Redactar mensajes de confirmación WhatsApp | `PUNTO_MERCADO_CONTEXT.md` §9 |
| **Tributario** | Resolver preguntas de IVA, boletas, PPM, régimen | `SII_TRIBUTARIO_CONTEXT.md` |

Un agente puede consultar otro archivo solo si su tarea lo cruza explícitamente (ej. el agente de costeo necesita el contexto tributario para calcular IVA real).

---

## 5. Pipeline Automático entre Agentes

Cuando un agente entrega un veredicto positivo, **Claude debe ofrecer automáticamente el siguiente paso** sin esperar que el usuario lo pida.

### Reglas de encadenamiento

| Si el agente devuelve... | Claude hace automáticamente... |
|---|---|
| `product-research` → ✅ INVESTIGAR MÁS | Ofrecer lanzar agente `costeo` con los datos del reporte |
| `costeo` → ✅ VIABLE o 🟡 AJUSTAR | Ofrecer lanzar agente `landing-page-builder` |
| `landing-page-builder` → HTML entregado | Ofrecer lanzar agente `copy-ads-writer` |
| `copy-ads-writer` → Copy entregado | Ofrecer lanzar agente `meta-ads-campaign` para estructurar campaña inicial |
| `meta-ads-campaign` → Campaña activa con datos | Recordar evaluar resultados después de 2 días completos |

### Comportamiento esperado

Al detectar un handoff, Claude pregunta:
> "¿Avanzo al siguiente paso — [nombre del agente]?"

Si el usuario confirma con sí, cualquier afirmación o dato similar, Claude lanza el agente correspondiente pasándole los datos relevantes del paso anterior como contexto inicial.

**No encadenar automáticamente** si:
- El veredicto es 🔴 DESCARTAR o 🔴 NO RECOMENDADO
- El usuario dice "para aquí" o similar

---

## 6. Restricciones Globales

- **Nunca inventar métricas.** Si no hay datos reales disponibles en el contexto, usar los promedios históricos del archivo fuente.
- **Copy siempre honesto.** Sin afirmaciones médicas, terapéuticas ni resultados garantizados.
- **Landings sin botón de compra.** Lo gestiona Shopify/Realisit.
- **Análisis de margen siempre con precio neto** (`precio_venta / 1.19`), no con precio bruto.
- **Decisiones de campaña** requieren mínimo 2 días completos de datos antes de evaluar.

---

## 6. Estructura del Proyecto

```
_Contexto/          ← Fuentes de verdad (leer, nunca modificar salvo actualización explícita)
_BrandKIT/          ← Assets visuales de marca
_Plantilla/         ← Plantillas reutilizables
CLAUDE.md           ← Este archivo (arquitectura e instrucciones para agentes)
```

---

*Este archivo define cómo trabajan los agentes, no qué es la marca. Para saber qué es la marca, leer `_Contexto/`.*
