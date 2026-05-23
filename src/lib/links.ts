/**
 * URL helpers — base-path aware and locale aware.
 *
 * The site is served from a subpath on GitHub Pages (/snc-ads-site/) and is
 * bilingual: Russian at the root, English under /en/.
 *
 * - `url(path)`          — base-prefixed path, no locale (Russian default).
 * - `localizedUrl(p,loc)`— base + locale prefix + path.
 * - `logicalPath(pn)`    — strip base + locale prefix from a pathname, giving
 *                          the language-neutral page path (used by the
 *                          language switcher).
 *
 * When a custom domain is connected, set `base: '/'` in astro.config.mjs —
 * everything here adjusts automatically.
 */
const BASE = import.meta.env.BASE_URL;

function baseClean(): string {
  return BASE.replace(/\/+$/, ''); // drop trailing slash(es)
}

/** Base-prefixed internal path (Russian / default locale). */
export function url(path: string): string {
  return baseClean() + '/' + String(path).replace(/^\/+/, '');
}

/** Base- and locale-prefixed internal path. locale 'en' → /en/..., else root. */
export function localizedUrl(path: string, locale: string): string {
  const p = '/' + String(path).replace(/^\/+/, '');
  const prefix = locale === 'en' ? '/en' : '';
  return baseClean() + prefix + p;
}

/**
 * Strip the base path and any /en locale prefix from a full pathname,
 * returning the language-neutral logical path ('/' or '/services' etc.).
 */
export function logicalPath(pathname: string): string {
  let p = pathname;
  const base = baseClean();
  if (base && p.startsWith(base)) p = p.slice(base.length);
  p = p.replace(/^\/en(?=\/|$)/, ''); // strip /en prefix
  p = p.replace(/\/+$/, '');          // strip trailing slash
  return p === '' ? '/' : p;
}
