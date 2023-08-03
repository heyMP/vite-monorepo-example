import { resolve } from 'path';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default ({
  build: {
    minify: false,
    terserOptions: false,
    target: false,
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/rhpt-dialog.ts'),
        resolve(__dirname, 'src/rhpt-link.ts')
      ],
      formats: ['es'],
    },
    rollupOptions: {
      treeshake: false,
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
