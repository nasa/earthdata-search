import axios from 'axios'
import https from 'https'
import axiosRetry from 'axios-retry'

import { stringify } from 'qs'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
// import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { readCmrResults } from './readCmrResults'
import { wrapAxios } from '../wrapAxios'

const wrappedAxios = wrapAxios(axios)

// Compensate for intermittent ENOTFOUND issues
axiosRetry(axios, { retries: 4 })

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
  console.log(`CMR token: ${cmrToken}`)
  const granuleSearchUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/granules.json`

  console.log(`Retrieving a single granule for ${collectionId}`)

  // Using an extension of request promise that supports retries
  const cmrResponse = await wrappedAxios({
    method: 'post',
    url: granuleSearchUrl,
    data: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
    headers: {
      // 'Client-Id': getClientId().background,
      'Content-Type': 'application/x-www-form-urlencoded' // ,
      // 'Echo-Token': cmrToken
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  })

  const { config } = cmrResponse
  const { elapsedTime } = config

  console.log(`Request for a single cmr granule successfully completed in ${elapsedTime} ms`)

  const responseBody = readCmrResults('search/granules.json', cmrResponse)

  return responseBody[0]
}
