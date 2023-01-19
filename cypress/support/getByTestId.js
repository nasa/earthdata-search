/**
 * Finds an element by using the data-testid attribute
 * @param {String} id data-testid attribute in markup
 */
export const getByTestId = (id) => cy.get(`[data-testid=${id}]`)
