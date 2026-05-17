/**
 * Prefix an internal path with the site's configured base path so links work
 * whether the site is served from a subpath (GitHub Pages: /snc-media-site/)
 * or from root (custom domain: /).
 *
 * Astro's import.meta.env.BASE_URL reflects the `base` config and may or may
 * not carry a trailing slash depending on how `base` is written — so this
 * helper normalizes both sides: strip any trailing slash from the base, force
 * exactly one leading slash on the path, then join.
 *
 * When a custom domain is connected, set `base: '/'` in astro.config.mjs and
 * every link produced here adjusts automatically — no other changes needed.
 *
 * Use only for INTERNAL paths ("/contact", "/"). External links (https://,
 * mailto:) must be passed through unchanged.
 */
const BASE = import.meta.env.BASE_URL;

export function url(path: string): string {
  const base = BASE.replace(/\/+$/, '');            // drop trailing slash(es)
  const p = '/' + String(path).replace(/^\/+/, ''); // exactly one leading slash
  return base + p;
}
