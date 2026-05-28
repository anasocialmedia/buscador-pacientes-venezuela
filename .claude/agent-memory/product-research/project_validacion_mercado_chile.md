---
name: validacion-mercado-chile
description: Criterios reales de validación de demanda para productos COD en Chile cuando Meta Ads Library no es accesible via scraping
metadata:
  type: project
---

Meta Ads Library (facebook.com/ads/library) no es accesible via WebFetch — requiere navegador con JavaScript. Las búsquedas directas fallan por timeout de socket.

**Señales alternativas de validación usadas en scouting Chile:**

1. Número de tiendas Shopify independientes activas vendiendo el mismo producto (buscando con Google)
2. Presencia en Mercado Libre con múltiples vendedores distintos y reviews recientes
3. Videos de Facebook de tiendas chilenas mostrando el producto con formato COD
4. Mentions en blogs de dropshipping chilenos (dropmax.cl, circlepack.cl) como producto ganador
5. Tiendas como tiendamish.cl, cupoclick.cl, mvtiendavirtual.cl, importadoravis.cl vendiendo el mismo ítem

**Señales de alerta:**
- Producto en Falabella/Sodimac/Lider como línea permanente = saturación
- Precio en tiendas especializadas muy bajo ($3.990-$8.000 CLP) = margen imposible para COD
- Solo disponible en Amazon/eBay/AliExpress sin presencia local = aún no validado en Chile

**How to apply:** Siempre triangular con al menos 3 fuentes distintas antes de clasificar como validado.
