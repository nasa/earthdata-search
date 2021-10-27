/**
 * Intercepts the default unauthenticated request and return the body and headers provided
 * @param {Object} body Response body to provide during the intercept
 * @param {Object} headers Response headers to provide during the intercept
 */
export const interceptUnauthenticatedCollections = (body, headers, additionalRequests = []) => {
  const defaultAlias = 'defaultCollectionAlias'

  // Intercept collections call before every test, its generic and doesn't change between tests
  cy.intercept({
    method: 'POST',
    url: '**/search/collections.json'
  },
  (req) => {
    // This log can be useful for debugging failed tests
    // console.log('interceptUnauthenticatedCollections ~ req.body', req.body)

    if (req.body === 'include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score') {
      req.alias = defaultAlias
      req.reply({
        body,
        headers
      })
    }

    additionalRequests.forEach((additionalRequest) => {
      const {
        alias,
        body: additionalBody,
        headers: additionalHeaders,
        params
      } = additionalRequest

      if (req.body === params) {
        req.alias = alias
        req.reply({
          body: additionalBody,
          headers: additionalHeaders
        })
      }
    })
  })

  return [defaultAlias, ...additionalRequests.map(additionalRequest => additionalRequest.alias)]
}
