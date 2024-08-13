import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'apps/ui/src/app/config/setup-vitests.ts',
        include: ['**/*.test.tsx']
    }
});
