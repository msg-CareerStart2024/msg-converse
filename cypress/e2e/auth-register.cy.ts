describe('User Register', () => {
    const baseFrontendUrl = 'http://localhost:4200/';
    const baseBackendUrl = 'http://localhost:3000/';

    it('should register a new user successfully and redirect to login', () => {
        cy.visit(baseFrontendUrl);

        cy.get('[href="/signup"]').click();
        cy.url().should('eq', `${baseFrontendUrl}signup`);

        cy.intercept('POST', `${baseBackendUrl}api/auth/register`).as('registerRequest');

        cy.get('input[name="firstName"]').type('Test');
        cy.get('input[name="lastName"]').type('Hard');
        cy.get('input[name="email"]').type('test@msg.group');
        cy.get('input[name="password"]').type('testPass1@3');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerRequest').then(interception => {
            const requestBody = interception.request.body;
            expect(interception.response?.statusCode).to.eq(201);

            expect(requestBody).to.have.property('firstName', 'Test');
            expect(requestBody).to.have.property('lastName', 'Hard');
            expect(requestBody).to.have.property('email', 'test@msg.group');
            expect(requestBody).to.have.property('password', 'testPass1@3');
        });

        cy.url().should('eq', `${baseFrontendUrl}login`);
    });

    it('should fail to register a new user', () => {
        cy.visit(baseFrontendUrl);

        cy.get('[href="/signup"]').click();
        cy.url().should('eq', `${baseFrontendUrl}signup`);

        cy.intercept('POST', `${baseBackendUrl}api/auth/register`).as('registerRequest');

        cy.get('input[name="firstName"]').type('Test');
        cy.get('input[name="lastName"]').type('Hard');
        cy.get('input[name="email"]').type('test@msg.group');
        cy.get('input[name="password"]').type('testPass1@3');
        cy.get('button[type="submit"]').click();

        cy.wait('@registerRequest').its('response.statusCode').should('eq', 400);

        cy.url().should('eq', `${baseFrontendUrl}signup`);
    });

    after(() => {
        cy.loginAndGetToken('test@msg.group', 'testPass1@3').then(function () {
            const token = this.accessToken;

            cy.request({
                method: 'DELETE',
                url: `${baseBackendUrl}api/users/${this.userId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .its('status')
                .should('eq', 200);
        });
    });
});
