/// <reference types="cypress" />

import './commands';

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
