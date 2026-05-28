# PUNTO MERCADO — Contexto Tributario SII Chile

> **Uso:** Contexto para el agente de IA especializado en tributación.  
> Este agente asesora sobre obligaciones fiscales del negocio de dropshipping COD en Chile.  
> **No es reemplazo de un contador.** Para decisiones definitivas, siempre validar con profesional.

---

## 1. SITUACIÓN DE PARTIDA

| Campo | Detalle |
|---|---|
| **Nombre del negocio** | Punto Mercado |
| **Modelo** | Dropshipping — pago contra entrega (COD) |
| **Mercado** | Chile |
| **Inicio de actividades SII** | Completado (Mayo 2026) |
| **Historial tributario previo** | Ninguno — se parte desde cero |
| **Productos anteriores** | No generan obligaciones tributarias formales (pre-inicio) |
| **Punto de partida real** | Nuevos productos testeados a partir del inicio de actividades |

---

## 2. CÓMO FUNCIONA EL NEGOCIO (para contexto tributario)

1. El cliente compra en Shopify y **paga cuando le llega el producto** (COD)
2. Punto Mercado hace el pedido al proveedor (Dropi) **sin pagar por adelantado** — es el cliente quien paga al recibir. Si el cliente no recibe el pedido, a Punto Mercado solo se le cobra el valor del envío.
3. El courier entrega al cliente y cobra el dinero
4. El courier liquida los pagos a Punto Mercado con cierta frecuencia (días/semanas después)
5. **No todas las órdenes se entregan** — existe una tasa de no-entrega (~25-30%)
6. Los proveedores son principalmente colombianos, venezolanos, chilenos y chinos (Dropi como intermediario)
7. La publicidad se paga directamente a Meta o TikTok (empresas extranjeras, cobran en USD)

### Flujo del dinero en una venta COD exitosa

```
Cliente → Paga al courier → Courier liquida a Punto Mercado
                                         ↓
                          Punto Mercado recibe el ingreso real
```

### Flujo cuando la orden NO se entrega

```
Cliente rechaza o no está → Producto devuelto → Sin ingreso
                                              → Costo de envío igualmente cobrado por el proveedor
```

---

## 3. LEY N° 21.713 — ANÁLISIS DE IMPACTO PARA PUNTO MERCADO

> Fuente: Q&A oficial de Dropi + Guía informativa de novedades tributarias 2026.  
> Vigencia: desde el 25 de octubre de 2025. IVA transfronterizo activo desde el 1 de enero de 2026.

### 3.1 ¿A quién aplica esta ley?

Aplica exclusivamente a **personas naturales o jurídicas SIN domicilio ni residencia en Chile** que vendan bienes a consumidores finales en Chile, cuando:
- Los bienes se entregan dentro del territorio nacional
- El valor de la operación **no excede USD 500** por operación
- Los bienes no están afectos a otro impuesto específico

### 3.2 ¿Aplica directamente a Punto Mercado?

**NO directamente.** Punto Mercado tiene domicilio en Chile y tiene inicio de actividades en el SII. No es el sujeto obligado de esta ley. Las obligaciones de Punto Mercado como negocio chileno se rigen por el régimen general del SII (boletas, IVA, PPM, Renta).

### 3.3 ¿Entonces la ley no le afecta en nada?

**Sí afecta, pero de forma indirecta.** Dos impactos concretos a monitorear:

**Impacto 1 — El costo de productos de proveedores extranjeros podría aumentar**

Los proveedores extranjeros en Dropi (colombianos, venezolanos, chinos) que venden a consumidores en Chile están ahora **obligados a cobrar el 19% de IVA** sobre el precio del producto. Si incorporan ese IVA a su precio de lista en Dropi, el costo del producto para Punto Mercado sube directamente.

```
Ejemplo con Vaso Termo Digital (proveedor colombiano — Trompila):
Costo anterior:            $4.500 CLP
Con IVA 21.713 incorporado: $4.500 × 1.19 = $5.355 CLP
Impacto en margen:         -$855 CLP por unidad entregada
```

⚠️ **Acción recomendada:** Antes de costear cualquier producto nuevo, verificar si el proveedor en Dropi ya actualizó sus precios post enero 2026. El costo que muestra Dropi hoy puede ya incluir este ajuste, o no.

**Impacto 2 — Dropi se deslinda totalmente de la responsabilidad tributaria**

Dropi declara explícitamente que:
- No vende ni compra bienes
- No emite boletas ni facturas por la venta
- No es responsable de incumplimientos tributarios de dropshippers
- Puede suspender o terminar la relación contractual si detecta incumplimiento

**Punto Mercado es el único responsable de sus propias obligaciones tributarias.** Dropi no resuelve nada de esto.

### 3.4 Resumen ejecutivo: obligaciones según actor

| Actor | Régimen aplicable | Obligación principal |
|---|---|---|
| **Punto Mercado** (domicilio en Chile, con RUT) | Régimen general SII | Boletas, IVA ventas, PPM, Renta anual |
| **Proveedor extranjero en Dropi** | Ley 21.713 | IVA 19% sobre venta transfronteriza ≤ USD 500 |
| **Dropi** | Ninguna | Solo plataforma tecnológica — no vende, no importa |

---

## 4. PREGUNTAS CLAVE POR RESOLVER (el agente debe responder estas)

### 3.1 Facturación y documentos tributarios

- **¿Cuándo exactamente nace la obligación de emitir boleta?**  
  ¿Al momento del pedido en Shopify? ¿Al confirmar por WhatsApp? ¿Al momento de la entrega real?  
  *(Diferencia crítica en COD: el cliente paga al recibir, no al pedir)*

- **¿Qué pasa con las órdenes que no se entregan?**  
  ¿Se anula la boleta? ¿Se emite una nota de crédito? ¿O simplemente no se emite boleta hasta la entrega?

- **¿Se puede usar el Servicio de Impuestos Internos (SII) para emitir boletas electrónicas gratuitamente?**  
  ¿O es necesario contratar un software de facturación?

- **¿Shopify emite algún documento tributario válido en Chile o hay que gestionarlo aparte?**

### 3.2 IVA

- **¿Cómo se calcula el IVA a pagar en un modelo COD con ~30% de no-entrega?**  
  ¿Se paga IVA sobre el total facturado aunque no todo llegue? ¿O solo sobre lo efectivamente cobrado?

- **¿El IVA de las compras a Dropi (proveedor colombiano) es recuperable como crédito fiscal?**  
  ¿Dropi emite facturas con IVA chileno o es importación de servicios?

- **¿Los gastos en Meta Ads (empresa extranjera, cobro en USD) generan IVA?**  
  ¿Aplica el "IVA a servicios digitales" del 19% que entró en vigor en Chile?

### 3.3 Gastos deducibles

- ¿Qué gastos son deducibles de la base imponible?
  - Costo de productos (Dropi)
  - Costo de envío (courier)
  - Gasto en publicidad Meta Ads
  - Subscripciones de software (Shopify, apps)
  - Comisiones de Dropi
  - Internet y equipos usados para el negocio

- **¿Cómo se documentan los gastos de un proveedor extranjero sin RUT chileno?**

### 3.4 Régimen tributario

- **¿Qué régimen tributario conviene para este modelo?**
  - Régimen General (14A)
  - Régimen PyME — Transparente (14D N°8)
  - Régimen PyME — Propyme General (14D N°3)
  - Régimen Simplificado (pequeños contribuyentes)

- **¿Cuáles son los tramos de ingresos que cambian las obligaciones?**  
  *(Para saber cuándo hay que cambiar de régimen o estructura)*

### 3.5 Estructura del negocio

- **¿Conviene operar como persona natural con inicio de actividades, o constituir empresa (SpA)?**
  - ¿Desde qué nivel de ventas mensuales conviene cambiar?
  - ¿Qué beneficios tributarios tiene una SpA vs. persona natural?
  - ¿Cuánto cuesta constituir una SpA en Chile?

- **¿Cuándo es obligatorio tener contador?**

---

## 5. CONCEPTOS TRIBUTARIOS QUE EL AGENTE DEBE CONOCER

### 4.1 IVA en Chile (Impuesto al Valor Agregado)
- Tasa: 19% sobre el precio de venta
- El precio de venta al público **incluye IVA**
- Precio neto = Precio bruto / 1.19
- IVA a pagar = Precio bruto - Precio neto
- Se declara mensualmente (Formulario 29) — vence el día 20 del mes siguiente
- Se puede compensar el IVA de las compras (crédito fiscal) contra el IVA de las ventas (débito fiscal)

```
IVA a pagar = Débito Fiscal (IVA ventas) - Crédito Fiscal (IVA compras)
```

**Impacto en el modelo de Punto Mercado:**
```
Precio venta publicado:  $25.990 CLP (IVA incluido)
Precio neto real:        $25.990 / 1.19 = $21.840 CLP
IVA que se debe al SII:  $4.150 CLP por unidad vendida
```

Esto significa que el **margen real se calcula sobre $21.840, no sobre $25.990.**

### 4.2 PPM (Pago Provisional Mensual)
- Anticipo mensual del Impuesto a la Renta
- Se paga un porcentaje de las ventas brutas cada mes
- Se descuenta al hacer la declaración anual de renta
- El % varía según el régimen y el historial del contribuyente (típicamente 0.25% – 1%)
- Se declara también en el Formulario 29

### 4.3 Impuesto a la Renta (Operación Renta)
- Declaración anual (Formulario 22) — vence en Abril
- Se paga sobre la **utilidad neta** (ingresos - gastos deducibles)
- Los PPM pagados durante el año se descuentan del total

### 4.4 IVA a servicios digitales extranjeros
- Desde 2020, Chile aplica 19% IVA a servicios digitales prestados desde el extranjero
- Meta Ads, Shopify, Google, etc. están obligados a recaudar este IVA directamente
- Si Meta cobra el IVA, el gasto ya incluye el impuesto → revisar facturas de Meta

### 4.5 Boleta electrónica obligatoria
- Desde 2021, todas las ventas a consumidor final requieren boleta electrónica
- Se puede emitir desde el portal del SII gratuitamente
- También existen softwares que se integran con Shopify (ej. Bsale, Nubox, Defontana)

---

## 6. MODELO DE COSTOS CON IMPACTO TRIBUTARIO

### Para cada nuevo producto testeado, el costeo real debe incluir:

```
PRECIO DE VENTA BRUTO (lo que ve el cliente)        = P
Precio neto sin IVA                                 = P / 1.19
IVA débito fiscal (se debe al SII)                  = P - (P / 1.19)

COSTOS DEDUCIBLES (con documentación):
- Costo producto (factura Dropi)                    = C_prod
- Costo envío (factura courier)                     = C_env
- Costo publicidad Meta (factura Meta)              = C_ads
- Subscripciones (Shopify, apps)                    = C_sub

UTILIDAD NETA REAL (base para renta):
= (P / 1.19) - C_prod - C_env - C_ads - C_sub

IVA CRÉDITO FISCAL (IVA de las compras que se recupera):
= IVA en facturas de proveedores nacionales
  (Los proveedores extranjeros sin RUT chileno generalmente NO generan crédito fiscal)
```

---

## 7. CHECKLIST MENSUAL DEL NEGOCIO

| Tarea | Fecha límite | Detalle |
|---|---|---|
| Emitir boletas de ventas | Por transacción | Al momento de entrega/cobro |
| Contactar proveedor para factura de producto | **Días 1–5 del mes** | Entregar detalle de órdenes entregadas + ID productos |
| Recibir facturas Dropi (flete) + proveedor (producto) | **Días 20–25 del mes** | Corresponden al mes anterior — guardar para crédito fiscal |
| Registrar gasto Meta Ads / TikTok (USD → CLP) | Por transacción | Al tipo de cambio del día |
| Declarar y pagar IVA + PPM (F29) | **Día 20 del mes siguiente** | Débito fiscal ventas menos crédito fiscal compras |
| Archivar todas las facturas recibidas | Por transacción | Respaldo para SII y para renta anual |
| Cambio de datos facturación en Dropi (si aplica) | **Antes del día 5** | Aplica al mes siguiente |

### ⚠️ Advertencia sobre el primer mes de operación
En el primer mes activo, las facturas de Dropi (crédito fiscal) aún no han llegado pero ya se generaron ventas (débito fiscal). Esto puede significar que el primer F29 tenga un IVA a pagar más alto de lo normal. Planificar caja para esto.

---

## 8. DOCUMENTACIÓN A SOLICITAR A PROVEEDORES

### 8.1 Flujo de facturación Dropi (fuente oficial: infografía Dropi)

Dropi **sí emite facturas** al dropshipper. Hay dos tipos separados:

#### A. Factura por FLETE (Dropi → Punto Mercado)
- **Qué se factura:** Fletes de órdenes con estado final **ENTREGADO** y **DEVUELTO**
  - ⚠️ Las devoluciones también generan cobro de flete
- **Flujo:**
  1. Dropi consolida las órdenes (primeros días del mes siguiente)
  2. Factura se emite al RUT registrado en el perfil de Dropi
  3. **Facturación desfasada** — Enero se factura en Febrero, Febrero en Marzo, etc.
  4. Factura se entrega entre los **días 20 y 25 de cada mes**
- **Cambio de datos a empresa:** Completar formulario antes del día 5 → aplica para el mes siguiente

#### B. Factura por PRODUCTO (Proveedor → Punto Mercado)
- **Qué se factura:** Solo los productos con estado **ENTREGADO**
- **Responsabilidad del dropshipper:** Debe entregar el detalle de productos entregados al proveedor
- **Flujo:**
  1. Contactar al proveedor entre los días **1–5 del mes**
  2. Entregar: órdenes, ID de productos y datos de facturación
  3. Proveedor consolida la información
  4. Factura se entrega entre los **días 20 y 25 del mes**

#### Reglas generales de facturación Dropi
1. La facturación es **mensual y desfasada** (el mes anterior se factura en el mes actual)
2. Las facturas llegan entre el **día 20 y 25**
3. Cambios de datos de facturación: hasta el **día 5** para aplicar al mes siguiente

---

### 8.2 Implicancias tributarias del flujo de facturación

**Para el F29 mensual (IVA):**
- Las facturas de Dropi llegan entre días 20–25 del mes en curso, pero corresponden al mes **anterior**
- El IVA crédito fiscal de esas facturas se puede usar en el F29 del mes en que se reciben
- Ejemplo: facturas de Enero llegan en Febrero entre días 20–25 → crédito fiscal usable en el F29 de Febrero (vence el 20 de Marzo)

**Para las boletas propias (IVA débito):**
- Punto Mercado debe emitir boleta por cada venta al momento de la entrega o cobro
- Las ventas cobradas en un mes generan débito fiscal que se declara en ese mismo mes

**Diferencia temporal crítica:**
```
Mes 1 (Enero):
  - Ventas y cobros → Débito fiscal Enero (declarar en F29 de Febrero)
  - Facturas de flete y producto → llegan entre 20-25 de Febrero → Crédito fiscal Febrero

Resultado: el IVA de las compras llega un mes después que el IVA de las ventas
→ En el primer mes de operación puede haber que pagar más IVA del esperado
```

**Qué hacer con la factura del proveedor de producto:**
- Si el proveedor es extranjero (colombiano, venezolano, chino) → verificar si la factura tiene RUT chileno y si genera crédito fiscal válido en Chile. Los proveedores sin domicilio en Chile posiblemente no generen crédito fiscal recuperable.
- Si el proveedor tiene representación o factura desde Chile → sí genera crédito fiscal.

---

### 8.3 Meta Ads y TikTok Ads (gasto en publicidad extranjera)
- Descargar facturas mensuales desde el Administrador de Anuncios de Meta y TikTok
- Verificar si Meta/TikTok cobró el 19% IVA directamente (Ley servicios digitales)
- Convertir montos USD → CLP al tipo de cambio del día de la transacción
- Guardar todos los comprobantes como respaldo de gasto

---

## 9. SEÑALES DE QUE NECESITAS UN CONTADOR YA

- Ventas mensuales superan los $2.000.000 CLP
- Tienes dudas sobre qué régimen tributario estás usando
- No estás emitiendo boletas en cada venta
- No has presentado el primer Formulario 29
- Estás pensando en constituir empresa (SpA)

---

## 10. GLOSARIO RÁPIDO

| Término | Definición |
|---|---|
| **RUT** | Rol Único Tributario — identificador del contribuyente |
| **SII** | Servicio de Impuestos Internos |
| **IVA** | Impuesto al Valor Agregado (19%) |
| **Débito fiscal** | IVA de las ventas (lo que debes al SII) |
| **Crédito fiscal** | IVA de las compras (lo que recuperas del SII) |
| **PPM** | Pago Provisional Mensual (anticipo del impuesto a la renta) |
| **F29** | Formulario 29 — declaración mensual de IVA y PPM |
| **F22** | Formulario 22 — declaración anual de renta |
| **Boleta electrónica** | Documento tributario para ventas a consumidor final |
| **Factura electrónica** | Documento tributario entre empresas (con crédito fiscal) |
| **14D** | Régimen PyME del Código Tributario |
| **SpA** | Sociedad por Acciones — tipo de empresa simple en Chile |

---

*Última actualización: Mayo 2026 | Punto Mercado*  
*⚠️ Este documento es orientativo. Para decisiones definitivas, consultar con contador certificado.*
