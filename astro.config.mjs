// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://paulkerr.com.au',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap(), mdx()],
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
});
