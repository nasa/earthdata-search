import request from 'request-promise'
import { stringify } from 'qs'
import { readCmrResults } from './readCmrResults'
import { getEarthdataConfig } from '../../../../sharedUtils/config'

/**
 * Retrieves a single granule result from CMR
 * @param {String} collectionId CMR Collection ID
 */
export const getSingleGranule = async (collectionId) => {
  const cmrParams = {
    echo_collection_id: collectionId,
    page_num: 1,
    page_size: 1
  }

  const granuleSearchUrl = `${getEarthdataConfig('prod').cmrHost}/search/granules.json?${stringify(cmrParams)}`

  const cmrResponse = await request.get({
    uri: granuleSearchUrl,
    json: true,
    resolveWithFullResponse: true
  })

  const responseBody = readCmrResults(granuleSearchUrl, cmrResponse)

  return responseBody[0]
}
