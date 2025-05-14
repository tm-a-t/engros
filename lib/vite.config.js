import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

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
      entry: {
        'index': 'src/index.ts',
        'node': 'src/node.ts',
      },
      fileName: (format, entryName) => `${entryName}${format === 'es' ? '.mjs' : '.cjs.js'}`,
      name: 'engros'
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ]
});


