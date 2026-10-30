/**
 * Cypress · los tres criterios del duelo.
 *
 * CA1 viene RESUELTO: léanlo, ejecútenlo (npm test) y entiendan cada línea ANTES de escribir los otros dos.
 * Los otros dos están en `it.skip(...)`: cambien `it.skip` por `it` cuando empiecen a implementarlos.
 */
describe('Duelo · tres criterios de aceptación', () => {
  // ------------------------------------------------------------------ EJEMPLO RESUELTO
  it('US-01 CA1: el catálogo muestra 8 productos', () => {
    cy.visit('/');

    // Cypress reintenta el comando y la aserción hasta que se cumplan (o se acabe el tiempo).
    cy.get('h3').should('have.length', 8);
  });

  // ------------------------------------------------------------------ TU TURNO · US-04 CA2
  it('US-04 CA2: no deja agregar 7 mochilas de una vez (stock 6) y avisa', () => {
    // Dado   un producto con stock 6 (la Mochila escolar),
    // Cuando intento agregar 7 unidades de una vez,
    // Entonces veo un aviso con el stock disponible y no se agrega nada.
    cy.visit('/');

    const aviso = cy.stub().as('aviso');
    cy.on('window:alert', aviso);
    cy.contains('h3', 'Mochila escolar').parent().within(() => {
      cy.get('input[type=number]').clear().type(7);
      cy.contains('button', 'Agregar').click();
    })
    cy.get('@aviso').should('have.been.calledWithMatch', 'Solo hay 6 unidades');
    cy.contains('Tu carrito está vacío').should('be.visible');
  });

  // ------------------------------------------------------------------ TU TURNO · US-09 CA1
  it('US-09 CA1: DESC10 descuenta el 10 % del subtotal', () => {
    // Dado   un carrito con productos (1 Mochila escolar, $ 65.000),
    // Cuando aplico el código DESC10,
    // Entonces el descuento es el 10 % del subtotal: $ 6.500.
    cy.visit('/');

    // Seleccionar cantidad
    cy.contains('h3', 'Mochila escolar')
      .parent()
      .within(() => {
        cy.contains('button', 'Agregar')
          .should('be.visible')
          .and('be.enabled')
          .click();
      });

    cy.contains('h2', 'Carrito').parent().within(() => {
      cy.get('input[placeholder="Código de descuento"]').type('DESC10');
      cy.contains('button', 'Aplicar').click();
    });

    // Verificar descuento
    cy.contains('dt', /^Descuento/)
      .siblings('dd')
      .should('contain.text', '6.500');

  });

});
