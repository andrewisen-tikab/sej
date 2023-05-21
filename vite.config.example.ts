import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        // minify: false,
        outDir: './dist/examples',
        rollupOptions: {
            input: {
                simple: resolve(__dirname, 'examples/simple/index.html'),
            },
            treeshake: false,
        },
    },
});
