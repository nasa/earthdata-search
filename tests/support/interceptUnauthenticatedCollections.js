import { defaultCollectionFormData, matchesFormData } from './matchesFormData'

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
    const request = route.request()

    if (includeDefault && await matchesFormData(request, defaultCollectionFormData)) {
      await route.fulfill({
        json: body,
        headers
      })

      return
    }

    if (additionalRequests.length) {
      await Promise.all(additionalRequests.map(async (additionalRequest) => {
        const {
          body: additionalBody,
          headers: additionalHeaders,
          paramCheck
        } = additionalRequest

        if (await paramCheck(request)) {
          await route.fulfill({
            json: additionalBody,
            headers: additionalHeaders
          })
        }
      }))
    }
  })
}
