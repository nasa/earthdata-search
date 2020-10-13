import request from 'request-promise'

import { parse as parseXml } from 'fast-xml-parser'

import { getClientId } from '../../../sharedUtils/getClientId'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Get the URL that will be used to retrieve granules from OpenSearch
 * @param {String} collectionId The collection ID to retrieve the url for.
 * @return {Object} An object representing the OpenSearch OSDD or an error message
 */
export const getCwicGranulesUrl = async (collectionId) => {
  const collectionTemplate = `https://cwic.wgiss.ceos.org/opensearch/datasets/${collectionId}/osdd.xml?clientId=eed-edsc-dev`

  console.log(`OpenSearch OSDD: ${collectionTemplate}`)

  try {
    const osddResponse = await request.get({
      time: true,
      uri: collectionTemplate,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda
      }
    })

    console.log(`Request for granules URL for CWIC collection '${collectionId}' successfully completed in ${osddResponse.elapsedTime} ms`)

    const osddBody = parseXml(osddResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const { OpenSearchDescription: opensearchDescription = {} } = osddBody
    const { Url: granuleUrls = [] } = opensearchDescription

    return {
      statusCode: osddResponse.statusCode,
      body: granuleUrls.find(url => url.type === 'application/atom+xml')
    }
  } catch (e) {
    return parseError(e)
  }
}
