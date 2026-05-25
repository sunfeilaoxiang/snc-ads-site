// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to Vercel at https://sncads.com/ (custom domain, 2026-05-25 cutover).
// `site` drives canonical URLs and OG tags; with no `base` option the default
// `/` keeps asset paths and internal links at the root.
//
// The url() helper in src/lib/links.ts adjusts every internal link automatically
// from `import.meta.env.BASE_URL`, so no app code needs to change when base changes.
export default defineConfig({
  site: 'https://sncads.com',
  // Bilingual: Russian at root (/), English under /en/.
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
