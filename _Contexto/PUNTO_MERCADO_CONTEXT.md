# PUNTO MERCADO — Contexto de Negocio para Agentes de Marketing

> **Uso:** Este archivo es el contexto maestro para todos los agentes de IA del negocio.  
> Cubre el flujo completo: investigación → costeo → landing → anuncios → campaña → optimización → tributación.

---

## 1. IDENTIDAD DEL NEGOCIO

| Campo | Detalle |
|---|---|
| **Nombre** | Punto Mercado |
| **Tagline** | Tienda Online |
| **Mercado** | Chile |
| **Modelo** | Dropshipping COD (pago contra entrega) |
| **Storefront** | Shopify |
| **Banner fijo** | `¡Envío GRATIS a todo Chile!` |
| **Prefijo CSS** | `pm-` |
| **Colores de marca** | Morado/violeta principal, blanco, amarillo/naranja acento |
| **Inicio actividades SII** | Sí (completado) |

---

## 2. STACK DE HERRAMIENTAS

| Herramienta | Rol |
|---|---|
| **Shopify** | Tienda online, gestión de productos |
| **Realisit App** | Procesamiento de órdenes COD en Shopify |
| **Dropi** | Gestión de fulfillment y proveedores |
| **Drofit** | Dashboard de analytics (métricas clave) |
| **Meta Ads** | Canal principal de tráfico pagado |
| **CapCut** | Creación de videos para anuncios (con TTS) |
| **Mercado Pago** | Link de pago prepago para direcciones no verificables |
| **WhatsApp** | Confirmación manual de órdenes COD |
| **Google Maps** | Verificación de direcciones antes de confirmar orden |
| **Seguimiento App** | App custom en Vercel que espeja métricas de Drofit |
| **GitHub** | `puntomercadocl-hue/Seguimiento-app` (localStorage key: `drofitv4`) |

### Proveedores habituales
- **Meibo** — productos varios
- **Importza** — productos varios (preferido en algunos)
- **Tendenza** — textiles/prendas
- **Diamac** — productos hogar
- **Tao** — varios
- **Trompila** — proveedor colombiano

---

## 3. FLUJO COMPLETO DE PRODUCTO (Pipeline)

```
[1. INVESTIGACIÓN DE PRODUCTO]
       ↓
[2. COSTEO Y VIABILIDAD]
       ↓
[3. LANDING PAGE EN SHOPIFY]
       ↓
[4. ÁNGULOS DE VENTA + COPY DE ANUNCIOS]
       ↓
[5. CAMPAÑA META ADS — Fase 1: Validación]
       ↓
[6. OPTIMIZACIÓN — Fase 2: Escalado]
```

---

## 4. FASE 1 — INVESTIGACIÓN DE PRODUCTOS

### Objetivo
Encontrar productos con potencial ganador **antes** de costear o producir contenido.

### 4.1 Meta Ads Library (Biblioteca de Anuncios)
- URL: `https://www.facebook.com/ads/library/`
- Parámetros útiles: `active_status=active`, `sort_data[mode]=total_impressions`
- **Señales de producto ganador:**
  - Múltiples anunciantes activos con el mismo producto
  - Anuncios corriendo muchos días (= está funcionando económicamente)
  - Videos con hooks de dolor/problema claros
  - Precio en rango $20.000–$45.000 CLP
  - Ángulo de "solución práctica para el hogar o cuidado personal"

### 4.2 Otras plataformas de espionaje
- **Minea** — espionaje de productos en Meta/TikTok
- **AdSpy** — biblioteca de anuncios con filtros avanzados
- **TikTok Creative Center** — productos en tendencia
- **Dropi** — explorar productos con alta demanda y buenos márgenes

### 4.3 Criterios de selección de producto

| Criterio | Parámetro ideal |
|---|---|
| Precio de venta | $22.000 – $45.000 CLP |
| Costo producto en Dropi | < $10.000 CLP |
| Problema que resuelve | Claro, cotidiano, universalmente comprensible |
| ¿Lo venden otros activamente? | Sí (validación de mercado) |
| ¿Tiene video creativo disponible? | Preferible sí |
| ¿El proveedor en Dropi entrega a todo Chile? | Verificar |
| ¿Alto riesgo de devolución? | Descartar si es cosmético/médico sin respaldo |

### 4.4 Búsqueda en Dropi
1. Ir a `app.dropi.cl/dashboard`
2. Buscar por nombre del producto o categoría
3. Revisar: precio del proveedor, stock, tiempo de entrega, ficha del producto
4. Anotar el **ID del producto** (en la URL: `/product-details/{ID}/`)

---

## 5. FASE 2 — COSTEO Y VIABILIDAD

### 5.1 Variables del modelo

| Variable | Descripción |
|---|---|
| `precio_venta` | Precio público en Shopify (CLP) |
| `costo_producto` | Precio Dropi del producto (CLP) |
| `costo_envio_promedio` | Promedio ponderado de envío ($7.500–$8.000 CLP) |
| `cpa_estimado` | Costo por compra estimado en Meta Ads |
| `pct_confirmadas` | % de órdenes confirmadas por WhatsApp (típico: 0.60–0.70) |
| `pct_entregadas` | % de confirmadas que se entregan (típico: 0.75–0.80) |
| `pct_reales` | `pct_confirmadas × pct_entregadas` (típico: 0.45–0.56) |

### 5.2 Fórmulas clave

```
Ingresos Reales          = precio_venta × pct_reales
Costos Producto Reales   = costo_producto × pct_reales
Costo Envío Total        = costo_envio_promedio × pct_confirmadas
Utilidad Unitaria Real   = Ingresos Reales - Costos Producto Reales
                           - Costo Envío Total - CPA
Margen Neto              = Utilidad Unitaria Real / Ingresos Reales
CPA Real por Entrega     = CPA / pct_reales
CPA Máximo Aceptable     = Ingresos Reales - Costos Producto Reales - Costo Envío Total
```

### 5.3 Umbrales de decisión

| CPA real obtenido | Decisión |
|---|---|
| ≤ $3.000 CLP | ✅ Producto GANADOR — escalar |
| $3.001 – $5.000 CLP | 🟡 Validando — continuar con ajustes |
| > $6.000 CLP | 🔴 Malo — evaluar apagar |

> El CPA aceptable en testeo es ≤ $5.000 CLP. El objetivo real de rentabilidad es ≤ $3.000 CLP.

### 5.4 Upsell segunda unidad (50% OFF)
- Tasa de aceptación estimada: 10% de los pedidos
- Aumenta el margen neto entre 12% y 57% según el producto

### 5.5 Impacto del IVA en el margen real

```
Precio neto sin IVA = precio_venta / 1.19
IVA a declarar      = precio_venta - (precio_venta / 1.19)
```

**El margen real debe calcularse sobre el precio neto (~84% del precio de venta).**

### 5.6 Historial de productos testeados

| Producto | ID Dropi | Precio Venta | Costo Prod. | Margen Neto |
|---|---|---|---|---|
| Máquina Selladora Vacío | 48988 | $29.990 | $5.800 | 10.3% |
| Pack Impresora + Papel | 92432 | $36.990 | $14.000 | 3.0% |
| Veggie Slicer | 27392 | $29.990 | $6.500 | 13.2% |
| Poleron Polar Cielo | 57836 | $27.990 | $6.500 | 7.0% |
| Poleron Polar Pelotas | 57834 | $27.990 | $6.500 | 7.0% |
| Poleron Polar Noche | 57839 | $27.990 | $6.500 | 7.0% |
| Secador de Zapatos | 56094 | $30.990 | $8.490 | 9.6% |
| **Vaso Termo Digital** | 104527 | $25.990 | $4.500 | 5.0% |
| Filtro Ducha | 77272 | $24.990 | $2.700 | 8.4% |
| Pelador Eléctrico | 99515 | $39.990 | $15.990 | 5.6% |
| Irrigador Bucal | 98238 | $27.990 | $4.500 | 6.1% |

---

## 6. FASE 3 — LANDING PAGE EN SHOPIFY

### 6.1 Especificaciones técnicas (NO NEGOCIABLES)

```
- Formato: HTML puro con CSS inline
- Fuentes: solo fuentes del sistema (system-ui, -apple-system, sans-serif)
- Ancho: max-width: 860px (o 100% si es layout columna)
- Prefijo de clases CSS: pm-
- Sin dependencias externas (sin Google Fonts, sin Bootstrap, sin JS libraries)
- Sin animaciones CSS complejas
- Listo para pegar en bloque HTML de descripción de Shopify
- NO incluir botón de compra (lo maneja Realisit/Shopify)
```

### 6.2 Protección de contenido (SIEMPRE incluir)

```html
<script>
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = '<div style="background:white;padding:30px;border-radius:12px;text-align:center;max-width:300px;"><p style="font-weight:bold;font-size:18px;margin-bottom:8px;">Punto Mercado</p><p style="color:#666;font-size:14px;">Contenido protegido</p><button onclick="this.parentElement.parentElement.remove()" style="margin-top:16px;padding:8px 24px;background:#6c3bd4;color:white;border:none;border-radius:8px;cursor:pointer;">Cerrar</button></div>';
    document.body.appendChild(modal);
  });
</script>
```

### 6.3 Estructura de secciones (orden estándar)

```
1. Hero          — Headline + subheadline + imagen producto + CTA visual
2. Problema      — ¿Qué dolor tiene el cliente? (sin solución aún)
3. Solución      — El producto como respuesta al problema
4. Beneficios    — Lista 3–5 puntos concretos (iconos + texto)
5. Cómo Funciona — Pasos simples (1-2-3)
6. Prueba Social — Testimonios o cantidad de clientes (si hay)
7. CTA Final     — Precio + garantía + urgencia
```

> Secciones se agregan/eliminan según el producto. No todas son obligatorias.

### 6.4 Elementos de conversión siempre presentes
- Banner "¡Envío GRATIS a todo Chile!" (color morado de marca)
- Precio tachado ("antes") + precio oferta actual
- Copy honesto: NO hacer afirmaciones médicas, terapéuticas o exageradas

---

## 7. FASE 4 — ÁNGULOS DE VENTA Y COPY DE ANUNCIOS

### 7.1 Frameworks de copywriting

#### PAS (Problema → Agitar → Solución)
**Disparadores:** Conciencia del punto de dolor, deseo de solución, aversión a la pérdida  
**Cuándo usar:** Productos que resuelven una frustración cotidiana clara
```
Problema:   [Situación frustrante específica del cliente]
Agitación:  [Consecuencias si no se resuelve — lo peor que puede pasar]
Solución:   [El producto como respuesta directa]
```

#### BAB (Antes → Después → Puente)
**Disparadores:** Principio de contraste, facilidad de uso, aspiracional  
**Cuándo usar:** Productos con transformación visual o cambio de rutina claro
```
Antes:   [Estado actual negativo]
Después: [Estado deseado con el producto]
Puente:  [El producto como el paso entre ambos]
```

#### AIDA (Atención → Interés → Deseo → Acción)
**Disparadores:** Brecha de curiosidad, especificidad, FOMO  
**Cuándo usar:** Anuncios de video o copy de feed con scroll rápido
```
Atención: Pregunta disruptiva o dato sorprendente
Interés:  Imagen mental del beneficio
Deseo:    "¿Y si pudieras...?" — resultado específico
Acción:   CTA directo con urgencia
```

#### 4P (Imagen → Promesa → Comprobar → Impulsar)
**Disparadores:** Visualización, confianza, urgencia  
**Cuándo usar:** Remarketing o públicos más tibios
```
Imagen:    Visualización del resultado ideal
Promesa:   Qué hace exactamente el producto
Comprobar: Prueba social / validación
Impulsar:  CTA con escasez o urgencia
```

### 7.2 Estructura de un anuncio completo para Meta

```
[HOOK — primeras 3 segundos o primera línea]
 → Pregunta de dolor O estadística sorprendente O situación reconocible

[CUERPO]
 → Desarrollar el problema (1-2 líneas)
 → Presentar el producto como solución
 → 2-3 beneficios concretos (no características)

[CTA]
 → "Haz tu pedido hoy → [URL]"
 → "Paga cuando llegue a tu puerta 🚪"
 → Reforzar envío gratis si aplica

[COPY PARA DESCRIPCIÓN DEL ANUNCIO]
 → Titular: máx 40 caracteres
 → Descripción: máx 125 caracteres antes del "Ver más"
```

### 7.3 Principios de copy de Punto Mercado
- Tono: cercano, directo, sin tecnicismos
- Nunca hacer afirmaciones médicas, terapéuticas o de resultados garantizados
- Posicionamiento honesto: lo que el producto genuinamente entrega
- Emojis con moderación (máx 3-4 por copy)
- Los hooks del video que funcionan → trasladar al copy escrito

---

## 8. FASE 5 — ESTRATEGIA DE CAMPAÑA EN META ADS

### 8.1 Estructura inicial (Fase de Validación)

```
CAMPAÑA ABO (Ad Budget Optimization)
├── Conjunto de anuncios 1 (audiencia broad o interés principal)
│   ├── Video 1
│   └── Video 2
```

- **Presupuesto inicial:** $7.000–$10.000 CLP/día total
- **Objetivo de campaña:** Ventas / Conversiones
- **Duración mínima antes de evaluar:** 2 días completos

### 8.2 Árbol de decisiones — Fase 1: Validación (días 1-2)

```
Después de gastar $7.000–$10.000 CLP:

├── Vendí 0 → APAGAR campaña
│
├── Vendí 1
│   └── Dejar hasta mediodía del día 2
│       ├── No vendí más → APAGAR
│       └── Vendí 1+ → Dejar día 2 completo → evaluar como "vendí 2+"
│
└── Vendí 2 o más → Dejar campaña día 2 completo
    └── Analizar CPA promedio ambos días:
        ├── CPA > $6.000 (Muy Malo) → APAGAR
        ├── CPA $4.000–$5.000 (Decente) → Dejar un día más
        └── CPA $1.000–$3.500 (Bueno) → TESTEAR CREATIVOS
            └── Día 3: lanzar 2+ videos nuevos en la misma ABO
```

### 8.3 Árbol de decisiones — Fase 2: Escalado

> En esta fase SÍ se toman decisiones por activo individual.  
> Evaluar cada 3 días completos (campaña, conjunto, anuncio).

```
Análisis cada 3 días:

├── CPA Muy Malo → APAGAR activo
│
└── CPA aceptable → Escalado Simultáneo:
    ├── [1] SIEMPRE: Seguir testeando creativos nuevos en ABO
    ├── [2] Si buen CPA últimos 3 días → Escalar vertical +20–30%
    └── [3] Si tienes 3+ videos con buenos números
            → Crear campaña CBO/Advantage+ con $30.000–$50.000 CLP/día
```

### 8.4 Casos de ejemplo

**Caso Malo:** Día 1 — $8.000 CLP gastados, 0 compras → APAGAR

**Caso Decente:**
- Día 1: $8.000 / 1 compra → CPA $8.000
- Si vende a mediodía del día 2 → dejar día completo
- CPA promedio $4–5 → dejar un día más / CPA bueno $1–3 → testear creativos

**Caso Bueno:**
- Día 1: $8.000 / 3 compras → CPA $2.666
- Día 2: $10.000 / 3 compras → CPA $3.333
- Día 3: lanzar 2 videos nuevos
- Evaluar cada activo cada 3 días: malo → apagar; bueno → +20–30%
- Con 3+ videos buenos → crear CBO/Adv+ con presupuesto mayor

---

## 9. FLUJO DE CONFIRMACIÓN DE ÓRDENES (COD)

### 9.1 Proceso paso a paso

1. Nueva orden entra en Shopify/Realisit
2. **Verificar dirección en Google Maps** antes de cualquier acción
   - Verificable → continuar
   - No verificable → pedir ubicación en vivo por WhatsApp o referencia cercana
   - Zona rural extrema → ofrecer prepago por Mercado Pago
3. Enviar mensaje de confirmación por WhatsApp

### 9.2 Template WhatsApp (tono: amigable, emojis, conciso)

```
Hola [Nombre] 👋 Te escribimos de *Punto Mercado*.

Recibimos tu pedido de *[Nombre del Producto]* 🎉

📦 Resumen de tu pedido:
• Producto: [Nombre]
• Total a pagar: $[TOTAL CON DESCUENTO] CLP
• Envío: GRATIS 🚚

¿Confirmamos tu pedido para la dirección [dirección verificada]?

Pago contra entrega — pagas cuando llegue a tu puerta 🏠
```

> **Siempre usar el total con descuento aplicado, nunca el subtotal pre-descuento.**

---

## 10. MODELO TRIBUTARIO — SII CHILE

> ⚠️ Este módulo requiere agente especializado.  
> **Punto de partida tributario:** Los 11 productos anteriores fueron pre-inicio de actividades o de referencia interna. Las obligaciones formales del SII aplican desde los **nuevos productos que se testeen a partir de ahora.**  
> Ver archivo dedicado: `SII_TRIBUTARIO_CONTEXT.md`

### 10.1 Situación actual
- Inicio de actividades completado en el SII
- Los nuevos productos testeados generan obligaciones tributarias reales desde el primer día
- No hay historial tributario previo que procesar — se parte desde cero de forma ordenada

### 10.2 Obligaciones clave (aplican a nuevos testeos)

| Obligación | Descripción | Frecuencia |
|---|---|---|
| **Boleta electrónica** | Emitir por cada venta (aunque sea COD) | Por transacción |
| **IVA (19%)** | Declarar mensualmente | Mensual (día 20) |
| **Declaración de Renta** | Ingresos y gastos anuales | Anual (Abril) |
| **PPM** | Pago Provisional Mensual | Mensual |
| **Registro de compras** | Facturas de proveedores nacionales y extranjeros | Por transacción |

### 10.3 Preguntas críticas para el agente tributario

1. ¿Cómo facturar en COD cuando no todas las órdenes se entregan?
2. ¿Las comisiones de Dropi son gasto deducible?
3. ¿El gasto en Meta Ads (empresa extranjera) es deducible? ¿Cómo?
4. ¿Cómo registrar el IVA de compras a proveedores en el exterior?
5. ¿Qué régimen tributario conviene más para este volumen? (14D PyME vs. simplificado)
6. ¿Cuándo conviene cambiar a empresa (SpA o Ltda.) vs. persona natural?

---

## 11. MÉTRICAS CLAVE (Drofit / Seguimiento App)

| Métrica | Fórmula |
|---|---|
| **TC (Tasa Confirmación)** | Confirmadas / Total órdenes |
| **TE (Tasa Entrega)** | Entregadas / Confirmadas |
| **Pct Reales** | TC × TE |
| **Ingreso Real** | Ventas Facturadas × TC × TE × Precio |
| **CPA Real** | Gasto en Ads / Unidades entregadas |
| **Margen Neto** | (Ingreso - Costos totales) / Ingreso |

---

## 12. PRODUCTO ACTIVO ACTUALMENTE

### Pistola de Masaje de Percusión (Gun Surtido)
- **ID Dropi:** 56201 | **Proveedor:** Eliphete | **Bodega:** Santiago
- **Precio de venta:** $27.990 CLP | **Costo producto:** $5.990 CLP
- **Precio sugerido Dropi:** $20.000 CLP | **Costo envío promedio:** $7.750 CLP
- **CPA techo testeo:** $5.973 CLP | **CPA objetivo ganador:** $3.000 CLP
- **Margen neto bruto:** 14,1% | **Margen post-IVA (CPA $4.000):** -10,6%
- **Specs reales:** 30 niveles de velocidad, 3.300 RPM, batería 2.500 mAh (8 horas), carga USB
- **Stock disponible:** 594 unidades
- **Landing:** Construida en Shopify (HTML inline) — GIFs pendientes de subir
- **Ángulo principal:** Contracturas y tensión muscular post-trabajo → alivio en casa sin cita ni masajista
- **⚠️ Verificar:** Si Eliphete es proveedor extranjero, el costo real puede ser $7.128 (Ley 21.713)

---

## 13. REGLAS PARA LOS AGENTES

1. **Nunca inventar métricas.** Si no hay datos reales, usar promedios del historial.
2. **El copy siempre es honesto.** Sin afirmaciones médicas o de resultados garantizados.
3. **El costeo siempre incluye** costo producto + costo envío + CPA estimado.
4. **Las landings no tienen botón de compra.** Shopify/Realisit lo gestiona.
5. **WhatsApp siempre usa** el total con descuento, tono amigable, emojis moderados.
6. **Decisiones de campaña** requieren mínimo 2 días completos de datos.
7. **No escalar** sin verificar CPA de últimos 3 días por activo.
8. **El IVA impacta el margen real.** Trabajar con precio neto en análisis profundos.

---

*Última actualización: Mayo 2026 | Punto Mercado*
