import request from 'promise-request-retry'

import { stringify } from 'qs'

import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { readCmrResults } from './readCmrResults'

/**
 * Returns tags for a collection based on a single granule sample
 * @param {String} cmrToken The CMR token used to authenticate the request
 * @param {Object} collectionId CMR Collection ID
 */
export const getSingleGranule = async (cmrToken, collectionId) => {
  const cmrParams = {
    echo_collection_id: collectionId,
    page_num: 1,
    page_size: 1
  }

  const granuleSearchUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}/search/granules.json`

  console.log(`Retrieving a single granule for ${collectionId}`)

  // Using an extension of request promise that supports retries
  const cmrResponse = await request({
    method: 'POST',
    uri: granuleSearchUrl,
    form: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
    headers: {
      'Client-Id': getClientId().background,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Echo-Token': cmrToken
    },
    json: true,
    resolveWithFullResponse: true,

    // Compensate for intermittent ENOTFOUND issues
    retry: 4
  })

  const responseBody = readCmrResults('search/granules.json', cmrResponse)

  return responseBody[0]
}
