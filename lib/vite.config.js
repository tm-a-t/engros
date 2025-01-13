import { defineConfig } from 'vite';
import { resolve } from 'path';

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
      entry: resolve(__dirname, 'src/index.tsx'),
      fileName: 'generative-layout',
      name: 'generative-layout'
    },
    cssCodeSplit: false
  }
});

