import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },

  esbuild: {
    // jsxFactory: 'DOMCreateElement',
  },

  build: {
    lib: {
      entry: 'src/index.tsx',
      formats: ['es', 'cjs'],
      fileName: (format) => `gl.${format}.js`
    }
  }
});