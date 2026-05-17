// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at https://sunfeilaoxiang.github.io/snc-media-site/
// `site` + `base` produce correct canonical URLs, asset paths, and links.
//
// When a custom domain is connected later:
//   - set `site` to the domain (e.g. 'https://snc-media.com')
//   - set `base` to '/'
// The url() helper in src/lib/links.ts adjusts every internal link automatically.
export default defineConfig({
  site: 'https://sunfeilaoxiang.github.io',
  base: '/snc-media-site',
  // Bilingual: Russian at root (/), English under /en/.
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
