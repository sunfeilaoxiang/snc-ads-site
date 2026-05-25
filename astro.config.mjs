// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Deployed to Vercel at https://sncads.com/ (custom domain, 2026-05-25 cutover).
// `site` drives canonical URLs and OG tags; with no `base` option the default
// `/` keeps asset paths and internal links at the root.
//
// `output: 'static'` keeps every page pre-rendered. Individual files (e.g.
// `src/pages/api/meta-capi.ts`) opt in to SSR/serverless by exporting
// `prerender = false` — Astro then ships them as Vercel Functions via the
// adapter below.
//
// The url() helper in src/lib/links.ts adjusts every internal link automatically
// from `import.meta.env.BASE_URL`, so no app code needs to change when base changes.
export default defineConfig({
  site: 'https://sncads.com',
  output: 'static',
  adapter: vercel(),
  // Bilingual: Russian at root (/), English under /en/.
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
