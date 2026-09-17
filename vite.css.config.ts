import { defineConfig, type Plugin } from 'vite';

/** Drops the empty JS chunk Rollup creates for a CSS-only entry. */
function cssOnly(): Plugin {
  return {
    name: 'mors-css-only',
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') delete bundle[fileName];
      }
    },
  };
}

/** Builds the single, standalone, framework-agnostic stylesheet. */
export default defineConfig({
  plugins: [cssOnly()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    cssMinify: false,
    rollupOptions: {
      input: { 'mors-component-library': 'src/styles/index.css' },
      output: { assetFileNames: '[name][extname]' },
    },
  },
});
