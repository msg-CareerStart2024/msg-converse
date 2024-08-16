import { defineConfig } from 'cypress';

export default defineConfig({
    env: {
        apiBaseUrl: 'http://localhost:3000/'
    },
    e2e: {
        baseUrl: 'http://localhost:4200/',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}'
    }
});