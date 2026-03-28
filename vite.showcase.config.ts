import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Showcase (web app) build — used by Vercel to serve the component docs site.
// Does NOT use library mode; outputs a regular index.html app to dist-showcase/.
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    outDir: 'dist-showcase',
    emptyOutDir: true,
  },
});
