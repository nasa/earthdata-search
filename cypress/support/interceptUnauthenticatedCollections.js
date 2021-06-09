/**
 * Intercepts the default unauthenticated request and return the body and headers provided
 * @param {Object} body Response body to provide during the intercept
 * @param {Object} headers Response headers to provide during the intercept
 */
export const interceptUnauthenticatedCollections = (body, headers) => {
  // Intercept collections call before every test, its generic and doesn't change between tests
  cy.intercept({
    method: 'POST',
    url: '**/search/collections.json'
  },
  (req) => {
    expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.extra.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

    req.reply({
      body,
      headers
    })
  })
}
