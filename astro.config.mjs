import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Fully static build — no adapter needed. Output lands in dist/, which both
// Netlify and Vercel serve as-is.
export default defineConfig({
  site: 'https://aagh.site',
  output: 'static',
  // About and Lab are sections of the home page now; keep the old URLs working.
  redirects: {
    '/about': '/#about',
    '/lab': '/#lab',
  },
  integrations: [
    react(),
    // Scratch and draft pages stay out of search: /book-test,
    // /zine-test and /board-test (3D viewers) and /projects/cabrillo-design (design-first
    // case study draft).
    sitemap({
      filter: (page) =>
        !page.includes('/book-test') &&
        !page.includes('/zine-test') &&
        !page.includes('/board-test') &&
        !page.includes('/cabrillo-design'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
