/**
 * Intercepts the default unauthenticated request and return the body and headers provided
 * @param {Object} body Response body to provide during the intercept
 * @param {Object} headers Response headers to provide during the intercept
 */
export const interceptUnauthenticatedCollections = (
  body,
  headers,
  additionalRequests = [],
  includeDefault = true
) => {
  const defaultAlias = 'defaultCollectionAlias'

  // Intercept collections call before every test, its generic and doesn't change between tests
  cy.intercept({
    method: 'POST',
    url: '**/search/collections.json'
  },
  (req) => {
    // This log can be useful for debugging failed tests
    // console.log('interceptUnauthenticatedCollections ~ req.body', req.body)

    if (includeDefault && req.body === 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score') {
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

  const defaultIncluded = []
  if (includeDefault) {
    defaultIncluded.push(defaultAlias)
  }

  return [
    ...defaultIncluded,
    ...additionalRequests.map((additionalRequest) => additionalRequest.alias)
  ]
}
