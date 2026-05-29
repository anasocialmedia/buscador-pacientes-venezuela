---
name: feedback-canva-design-types
description: Which Canva design types work reliably for Punto Mercado ad assets vs which fail
metadata:
  type: feedback
---

Use `poster` design type for ALL Punto Mercado ad asset generation — square feed ads, vertical thumbnails, and story formats. Do NOT use `instagram_post`, `facebook_post`, or `your_story` types as they consistently fail with empty generated_designs arrays (likely Magic Design quota exhaustion on those specific types for this account).

**Why:** In the first creative session (May 2026), `instagram_post`, `facebook_post`, and `your_story` all returned status "failed" with empty results. `poster` succeeded every time for the same prompts.

**How to apply:** Always start with `poster` type regardless of intended final format. The output can still be resized or exported at the correct dimensions. For vertical/9:16 thumbnails, describe "vertical format" or "tall vertical composition" in the query.
