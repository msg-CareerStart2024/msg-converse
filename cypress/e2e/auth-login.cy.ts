describe('User Login', () => {
    const baseBackendUrl = Cypress.env().apiBaseUrl;
    let userId: string;
    let token: string;

    before(() => {
        const mockUser = {
            email: 'test@msg.group',
            firstName: 'Test',
            lastName: 'Hard',
            password: 'testPass1@3',
            role: 'USER'
        };
        cy.request('POST', `${baseBackendUrl}api/auth/register`, mockUser).then(response => {
            userId = response.body.id;
        });
    });

    it('should log in and receive a valid token', () => {
        cy.visit('/');

        cy.intercept('POST', `${baseBackendUrl}api/auth/login`).as('loginRequest');

        cy.get('input[name="email"]').type('test@msg.group');
        cy.get('input[name="password"]').type('testPass1@3');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 201);

        cy.url().should('eq', `${Cypress.config().baseUrl}`);

        cy.window().then(win => {
            cy.wrap(win.localStorage).its('accessToken').should('exist');
            token = win.localStorage.accessToken;
        });

        cy.get('[data-testid="logged-in-user"]>span').should('have.text', 'Test Hard');
    });

    it('should fail log in and display an error', () => {
        cy.visit('/');

        cy.intercept('POST', `${baseBackendUrl}api/auth/login`).as('loginRequest');

        cy.get('input[name="email"]').type('test@wrong.group');
        cy.get('input[name="password"]').type('badPassWord1@3');
        cy.get('button[type="submit"]').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

        cy.url().should('contain', '/login');

        cy.window().then(win => {
            cy.wrap(win.localStorage).its('accessToken').should('not.exist');
        });

        cy.get('[data-testid="login-error"]>.MuiAlert-message').should(
            'contain.text',
            'Invalid email or password'
        );
    });

    after(() => {
        cy.request({
            method: 'DELETE',
            url: `${baseBackendUrl}api/users/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    });
});
