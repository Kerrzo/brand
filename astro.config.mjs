// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kerrzo.github.io/brand',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
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
  base: '/brand',
  // Force static output for GitHub Pages
  experimental: {
    assets: true,
  },
});