import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },

  define: {
    global: {}  // Workaround for Hydra: see https://github.com/hydra-synth/hydra-synth?tab=readme-ov-file#vite
  },

  build: {
    lib: {
      entry: 'src/index.tsx',
      formats: ['es', 'cjs'],
      fileName: (format) => `gl.${format}.js`
    }
  }
});