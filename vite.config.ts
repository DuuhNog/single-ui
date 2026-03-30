import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    dts({
      include: ['src/index.ts', 'src/components/**/*', 'src/hooks/**/*'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/App.tsx', 'src/main.tsx', 'src/test/**/*'],
      rollupTypes: true,
    }),
    {
      name: 'copy-style-dts',
      closeBundle() {
        writeFileSync(
          resolve(__dirname, 'dist/style.d.ts'),
          `declare module '@single-ui/react/styles' {\n  const styles: string;\n  export default styles;\n}\n`
        );
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SingleUI',
      formats: ['es', 'umd'],
      fileName: (format) => `single-ui-react.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: () => 'style.css',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
