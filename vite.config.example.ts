import { resolve } from 'path';
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

import { EXAMPLES } from './examples';

// @ts-ignore
const input: { [key: string]: resolve } = {};

EXAMPLES.forEach((example) => {
    input['examples'] = resolve(__dirname, `examples/index.html`);
    input[example] = resolve(__dirname, `examples/examples/${example}/index.html`);
});

export default defineConfig({
    base: './',
    build: {
        target: 'esnext',
        // minify: false,
        outDir: './dist/examples',
        rollupOptions: {
            input,
            // treeshake: false,
        },
    },
    plugins: [
        splitVendorChunkPlugin(),
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: '__tla',
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: (i) => `__tla_${i}`,
        }),
    ],
});
