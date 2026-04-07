import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Stub optional PDF-export dependencies so tests don't fail when the
      // packages are not installed in the dev environment.
      'html2canvas': resolve(__dirname, 'src/test/stubs/html2canvas.ts'),
      'jspdf':       resolve(__dirname, 'src/test/stubs/jspdf.ts'),
    },
  },
});
