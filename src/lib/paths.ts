/**
 * Prefix a site-root path with Astro's configured base
 * (e.g. `/brand/` on GitHub Pages, `/` in local dev).
 */
export function withBase(path: string): string {
  if (
    !path ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#') ||
    path.startsWith('//')
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL; // always ends with /

  if (path.startsWith('/')) {
    if (base !== '/' && (path === base.slice(0, -1) || path.startsWith(base))) {
      return path;
    }
    return `${base}${path.slice(1)}`;
  }

  return `${base}${path}`;
}
