import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Lazy chunks and their stylesheets resolve next to the entry, wherever the theme is published.
    base: './',
    build: {
        manifest: true,           // generates .vite/manifest.json
        outDir: 'public',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: resolve(__dirname, 'assets/js/app.js'),
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // Allow importing Bootstrap SCSS partials without path
                loadPaths: ['node_modules'],
            },
        },
    },
});
