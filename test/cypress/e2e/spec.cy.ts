import { EXAMPLES } from '../../../examples.js';

describe('template spec', () => {
    it('Examples Homepage', () => {
        cy.visit('/');
    });

    EXAMPLES.forEach((example) => {
        it(`Visit ${example}`, () => {
            cy.visit(`./examples/${example}/`);
            cy.wait(2_000);

            cy.window().then((win) => {
                cy.log(`START test: ${example}`);
                expect(
                    // @ts-ignore
                    win.example.test(),
                ).to.equal(true);
                cy.log(`END test: ${example}`);
            });
        });
    });
});
