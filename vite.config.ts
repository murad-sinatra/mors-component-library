import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/** Demo / documentation site + test runner configuration. */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-demo',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    css: false,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
