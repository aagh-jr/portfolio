import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Fully static build — no adapter needed. Output lands in dist/, which both
// Netlify and Vercel serve as-is.
export default defineConfig({
  site: 'https://aagh.site',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
