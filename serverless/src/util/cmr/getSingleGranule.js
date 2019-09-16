import request from 'request-promise'
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

  try {
    const granuleSearchUrl = `${getEarthdataConfig(cmrEnv()).cmrHost}/search/granules.json`

    const cmrResponse = await request.post({
      uri: granuleSearchUrl,
      form: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
      headers: {
        'Client-Id': getClientId().background,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Echo-Token': cmrToken
      },
      json: true,
      resolveWithFullResponse: true
    })

    const responseBody = readCmrResults(granuleSearchUrl, cmrResponse)

    return responseBody[0]
  } catch (e) {
    console.log(`Failed retrieving a single granule for ${collectionId}`)
    console.log(e)
  }

  return null
}
