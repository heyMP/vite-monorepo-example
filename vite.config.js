import { resolve } from 'path'
import { defineConfig } from 'vite'
import { nodeResolve } from '@rollup/plugin-node-resolve';


/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    minify: false,
    terserOptions: false,
    // target: 'es2020',
    target: false,
    lib: {
      entry: [
        resolve(__dirname, 'elements/index.ts'),
        resolve(__dirname, 'elements/rhpt-dialog.ts'),
        resolve(__dirname, 'elements/rhpt-link.ts')
      ],
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        minifyInternalExports: false
      },
      external: [
        /^lit*/,
        /^@patternfly\/elements*/,
        /^@patternfly\/pfe-core*/,
        /^@rhds\/elements*/
      ],
    }
  }
});
