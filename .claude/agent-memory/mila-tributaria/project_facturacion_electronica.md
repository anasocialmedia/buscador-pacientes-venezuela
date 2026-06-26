---
name: project-facturacion-electronica
description: Estado de la inscripción de Punto Mercado en el sistema de facturación electrónica del SII — qué documentos tiene autorizados y qué pendientes quedan.
metadata:
  type: project
---

Punto Mercado completó la inscripción en el Sistema de Facturación Gratuito del SII (junio 2026). Confirmado el 2026-06-03.

Documentos autorizados para emitir (confirmados al 2026-06-03):
- Factura Electrónica
- Factura No Afecta o Exenta Electrónica
- Guía de Despacho Electrónica
- Nota de Débito Electrónica
- Nota de Crédito Electrónica

**PENDIENTE CRITICO — Boleta Electrónica:** No aparece en la lista de documentos autorizados. La boleta es el documento prioritario para un negocio COD B2C. Debe habilitarse por separado en el portal del SII via: Factura Electrónica → Boleta de Ventas y Servicios Electrónica → Administración → Solicitud de Autorización. Paso a paso detallado entregado al usuario el 2026-06-03. Representante legal registrado el 2026-06-03 — esto desbloquea la operación del sistema de facturación.

**PENDIENTE — Boleta de mayo retroactiva:** Orden #6342260 — $59.985 — 05/05/2026. Emitir con RUT receptor 66.666.666-6 (consumidor final anónimo) una vez que la boleta electrónica quede habilitada.

**PENDIENTE — Configuración del equipo:** El usuario aún no ha configurado el computador siguiendo las instrucciones del SII post-inscripción. Sin esta configuración no puede emitir documentos desde el sistema (aplica al Sistema de Facturación; la boleta electrónica funciona desde el navegador sin configuración adicional).

**PENDIENTE — Certificado digital:** No resuelto. No necesario para boletas (se emiten desde el portal web sin certificado). Sí necesario para facturas electrónicas. Cotizar en E-certchile / Acepta / GlobalSign (~$30.000–$80.000 CLP/año) cuando sea necesario.

**Decisión validada — Software de facturación:** Usuario opera con el SII gratuito. Se analizó y descartó contratar software como Bsale/Factoplus/Nubox por estas razones: (1) volumen actual de 1–10 boletas/mes no justifica el costo mensual (~$15.000–$25.000 CLP), (2) el trigger correcto para emitir boleta en COD está en Dropi (estado ENTREGADO), no en Shopify — lo que invalida la automatización que venden esos softwares. Punto de inflexión para reevaluar: más de 100–150 boletas/mes o necesidad contable activa.

**Why:** El inicio de actividades fue el 11-04-2026 (TC Comercial SpA, RUT 78.390.398-9). Ya existe una venta de mayo sin boleta emitida.

**How to apply:** Cuando el usuario consulte sobre boletas, confirmar que la boleta electrónica probablemente ya está pendiente de habilitar — y que el flujo operativo es: Dropi marca ENTREGADO → emitir boleta ese mismo día en misiir.sii.cl.
