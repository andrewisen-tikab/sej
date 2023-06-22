import { resolve } from 'path';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

const EXAMPLES = [
    'simple',
    'tileset',
    'glb-copies',
    'memory-test',
    'google-tileset',
    'objects',
    'transform',
] as const;

const input: { [key: string]: resolve } = {};

EXAMPLES.forEach((example) => {
    input[example] = resolve(__dirname, `examples/${example}/index.html`);
});

export default defineConfig({
    base: './',
    build: {
        target: 'esnext',
        minify: false,
        outDir: './dist/examples',
        rollupOptions: {
            input,
            treeshake: false,
        },
    },
    plugins: [
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: '__tla',
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: (i) => `__tla_${i}`,
        }),
    ],
});
