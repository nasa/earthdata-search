/**
 * Intercepts the default unauthenticated request and return the body and headers provided
 * @param {Object} body Response body to provide during the intercept
 * @param {Object} headers Response headers to provide during the intercept
 */
export const interceptUnauthenticatedCollections = async ({
  additionalRequests = [],
  body,
  headers,
  includeDefault = true,
  page
}) => {
  // Intercept collections call before every test, its generic and doesn't change between tests
  await page.route(/search\/collections.json/, async (route) => {
    const query = route.request().postData()

    if (includeDefault && query === 'has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-usage_score') {
      await route.fulfill({
        json: body,
        headers
      })
    }

    if (additionalRequests.length) {
      await Promise.all(additionalRequests.map(async (additionalRequest) => {
        const {
          body: additionalBody,
          headers: additionalHeaders,
          params
        } = additionalRequest

        if (query === params) {
          await route.fulfill({
            json: additionalBody,
            headers: additionalHeaders
          })
        }
      }))
    }
  })
}
