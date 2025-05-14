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
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `engros.${format === 'es' ? 'js' : 'umd.cjs'}`;
        }
        return `${entryName}.${format === 'es' ? 'js' : 'umd.cjs'}`;
      },
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
