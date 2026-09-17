import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Library JS build. Types are emitted by `tsc -p tsconfig.build.json` and the
 * stylesheet is bundled by `vite.css.config.ts`, so this build stays JS-only.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `mors-component-library.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
    },
  },
});
