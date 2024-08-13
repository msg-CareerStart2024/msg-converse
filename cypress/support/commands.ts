/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/index.ts

// Import commands.ts if not already imported
import './commands';

// Declare the command interface in TypeScript
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to log in and retrieve the access token.
             * @example cy.loginAndGetToken('email@example.com', 'password')
             */
            loginAndGetToken(email: string, password: string): Chainable<string>;
        }
    }
}

Cypress.Commands.add('loginAndGetToken', (email, password) => {
    cy.intercept('POST', `localhost:3000/api/auth/login`).as('loginRequest');

    cy.request({
        method: 'POST',
        url: `localhost:3000/api/auth/login`,
        body: {
            email,
            password
        }
    }).then(response => {
        const accessToken = response.body.accessToken;
        const userId = response.body.user.id;
        cy.wrap(accessToken).as('accessToken');
        cy.wrap(userId).as('userId');
    });
});
