/**
 * Prefix an internal path with the site's configured base path so links work
 * whether the site is served from a subpath (GitHub Pages: /snc-media-site/)
 * or from root (custom domain: /).
 *
 * When a custom domain is connected, set `base: '/'` in astro.config.mjs and
 * every link produced here adjusts automatically — no other changes needed.
 *
 * Use only for INTERNAL paths ("/contact", "/"). External links (https://,
 * mailto:) must be passed through unchanged.
 */
const BASE = import.meta.env.BASE_URL; // always ends with "/"

export function url(path: string): string {
  return BASE + path.replace(/^\/+/, '');
}
