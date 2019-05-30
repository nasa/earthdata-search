import request from 'request-promise'
import { stringify } from 'qs'
import { getEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Query CMR using JQL
 * @external JSONQueryLanguage
 * @see https://cmr.sit.earthdata.nasa.gov/search/site/JSONQueryLanguage.json
 * @param {Object} queryParams Query parameters to send to CMR that are not supported by JQL
 * @param {String} searchCriteria Criteria used to search for collections in JQL
 * @param {String} cmrToken The CMR token used to authenticate the request
 * @return {Object} The response body from CMR
 */
export async function getCollectionsByJson(queryParams, searchCriteria, cmrToken) {
  const collectionUrl = `${getEarthdataConfig('prod').cmrHost}/search/collections.json?${stringify(queryParams)}`

  try {
    const collectionResponse = await request.post({
      uri: collectionUrl,
      headers: {
        'Echo-Token': cmrToken
      },
      body: searchCriteria,
      followAllRedirects: true,
      json: true,
      resolveWithFullResponse: true
    })

    if (collectionResponse.statusCode === 200) {
      const { feed } = collectionResponse.body

      return feed
    }

    return collectionResponse.body
  } catch (e) {
    console.log(e)

    return { errors: [e] }
  }
}

export default getCollectionsByJson
