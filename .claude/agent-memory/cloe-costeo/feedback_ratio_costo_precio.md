---
name: feedback_ratio_costo_precio
description: Regla de descarte rápido: si costo_producto / precio_venta > 40%, calcular CPA Máximo Aceptable antes de completar el modelo completo
metadata:
  type: feedback
---

Si el ratio costo_producto / precio_venta supera el 40%, calcular el CPA Máximo Aceptable como primer paso. Si es menor a $3.000 CLP, el producto es inviable sin necesidad de correr el modelo completo.

**Why:** El Masajeador de Cuello (56,3% ratio) demostró que un costo de proveedor alto elimina todo el margen antes de sumar envío y publicidad. El benchmark saludable del historial de Punto Mercado es costo/precio < 35%.

**How to apply:** Antes de completar el costeo completo, hacer el check rápido: (precio_venta × pct_reales) - (costo_producto × pct_reales) - (costo_envio × pct_confirmadas). Si ese resultado es < $3.000 CLP, el producto es descarte inmediato independientemente del CPA.
