/**
 * Finds an element by using the data-test-id attribute
 * @param {String} id data-test-id attribute in markup
 */
export const getByTestId = (id) => cy.get(`[data-test-id=${id}]`)
