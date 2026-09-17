import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Demo / documentation site configuration. */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-demo',
    sourcemap: true,
  },
});
