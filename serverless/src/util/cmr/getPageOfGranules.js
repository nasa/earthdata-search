import axios from 'axios'
import axiosRetry from 'axios-retry'

import { stringify } from 'qs'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { readCmrResults } from './readCmrResults'
import { wrapAxios } from '../wrapAxios'

const wrappedAxios = wrapAxios(axios)

// Compensate for intermittent ENOTFOUND issues
axiosRetry(axios, { retries: 4 })

/**
 * Returns a single page of CMR granules
 * @param {String} cmrToken The CMR token used to authenticate the request
 * @param {String} collectionId CMR Collection ID
 * @param {Integer} pageSize Now many granules to return (max: 2000, default: 20)
 */
export const getPageOfGranules = async (cmrToken, collectionId, pageSize = 20) => {
  const cmrParams = {
    echo_collection_id: collectionId,
    page_num: 1,
    page_size: pageSize
  }

  const granuleSearchUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/granules.json`

  console.log(`Retrieving a page of ${pageSize} granule(s) for ${collectionId}`)

  // Using an extension of request promise that supports retries
  const cmrResponse = await wrappedAxios({
    method: 'post',
    url: granuleSearchUrl,
    data: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
    headers: {
      'Client-Id': getClientId().background,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${cmrToken}`
    }
  })

  const { config } = cmrResponse
  const { elapsedTime } = config

  console.log(`Request for a page of cmr granule(s) successfully completed in ${elapsedTime} ms`)

  return readCmrResults('search/granules.json', cmrResponse)
}
