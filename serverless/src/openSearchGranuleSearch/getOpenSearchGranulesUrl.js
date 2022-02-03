import axios from 'axios'

import { parse as parseXml } from 'fast-xml-parser'

import { getClientId } from '../../../sharedUtils/getClientId'
import { parseError } from '../../../sharedUtils/parseError'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

/**
 * Get the URL that will be used to retrieve granules from OpenSearch
 * @param {String} collectionId The collection ID to retrieve the url for.
 * @return {Object} An object representing the OpenSearch OSDD or an error message
 */
export const getOpenSearchGranulesUrl = async (collectionId, openSearchOsddUrl) => {
  console.log(`OpenSearch OSDD: ${openSearchOsddUrl}`)

  try {
    const osddResponse = await wrappedAxios.get(openSearchOsddUrl, {
      headers: {
        'Client-Id': getClientId().lambda
      }
    })

    const { config, data } = osddResponse
    const { elapsedTime } = config

    console.log(`Request for granules URL for OpenSearch collection '${collectionId}' successfully completed in ${elapsedTime} ms`)

    const osddBody = parseXml(data, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
      ignoreNameSpace: true
    })

    const { OpenSearchDescription: opensearchDescription = {} } = osddBody
    let { Url: granuleUrls = [] } = opensearchDescription
    if (!Array.isArray(granuleUrls)) {
      granuleUrls = [granuleUrls]
    }

    return {
      statusCode: osddResponse.status,
      body: granuleUrls.find((url) => url.type === 'application/atom+xml')
    }
  } catch (e) {
    return parseError(e)
  }
}
