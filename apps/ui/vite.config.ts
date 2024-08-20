/// <reference types='vitest' />

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/ui',

    server: {
        port: 4200,
        host: '127.0.0.1',

        proxy: {
            '/socket.io': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                ws: true
            }
        }
    },

    preview: {
        port: 4300,
        host: 'localhost'
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
        outDir: '../../dist/apps/ui',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true
        }
    }
});
