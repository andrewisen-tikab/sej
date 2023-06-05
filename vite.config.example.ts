import { resolve } from 'path';
import { defineConfig } from 'vite';

const EXAMPLES = ['simple', 'tileset', 'glb-copies', 'memory-test'] as const;

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
});
