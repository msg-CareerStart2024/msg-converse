import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'apps/ui/src/tests/setup-vitests.ts'
    }
});
