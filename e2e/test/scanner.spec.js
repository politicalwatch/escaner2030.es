describe('The scanner', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('appears in the frontpage', () => {
        cy.get('.c-page-header__title')
            .contains('Scanner')
        cy.get('.o-grid__col textarea')
            .should('exist')
        cy.get('.o-grid__col label')
            .contains('Sube un archivo')
    })

    it('can send texts to be analyzed', () => {
        cy.get('.o-grid__col textarea')
            .type('Text submission')
        cy.get('#start')
            .contains('Iniciar proceso')
        cy.get('#start')
            .click()
        cy.get('#start')
            .contains('Procesando')

        cy.get('.c-message__wrapper', { timeout: 2000 })
            .should('be.visible')
    })
})
