// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// `astro dev` (unlike the production build, `astro preview`, and real static
// hosts like GitHub Pages) doesn't auto-append index.html for directory-style
// requests into public/ subfolders — a known Vite dev-server limitation, not
// an Astro routing bug. Static sandboxes like /sandbox/vesper/ live entirely
// in public/, so without this they 404 in `npm run dev` even though they
// build and deploy correctly. Dev-only; does nothing during `astro build`.
/** @returns {import('vite').Plugin} */
function publicDirIndexFallback() {
  return {
    name: 'public-dir-index-fallback',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.endsWith('/') && req.url.startsWith('/sandbox/')) {
          req.url += 'index.html';
        }
        next();
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://paulkerr.com.au',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [publicDirIndexFallback()],
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css') || assetInfo.name.endsWith('.js')) {
              return 'assets/[name].[hash].[ext]';
            }
            return 'assets/[name].[hash].[ext]';
          },
        },
      },
    },
  },
});
