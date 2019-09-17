import request from 'promise-request-retry'
import { stringify } from 'qs'
import { readCmrResults } from './readCmrResults'
import { getEarthdataConfig, getClientId } from '../../../../sharedUtils/config'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'

/**
 * Retrieves a single granule result from CMR
 * @param {String} collectionId CMR Collection ID
 */
export const getSingleGranule = async (cmrToken, collectionId) => {
  const cmrParams = {
    echo_collection_id: collectionId,
    page_num: 1,
    page_size: 1
  }

  const granuleSearchUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}/search/granules.json`

  console.log(`Retrieving a single granule for ${collectionId}`)
  const cmrResponse = await request.post({
    uri: granuleSearchUrl,
    form: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
    headers: {
      'Client-Id': getClientId().background,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Echo-Token': cmrToken
    },
    json: true,
    resolveWithFullResponse: true,
    // in case of ENOTFOUND
    retry: 4
  })

  const responseBody = readCmrResults(granuleSearchUrl, cmrResponse)

  return responseBody[0]
}
