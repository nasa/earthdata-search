import 'array-foreach-async'
import request from 'request-promise'
import { cmrUrl } from './cmrUrl'
import { readCmrResults } from './readCmrResults'
import { getSystemToken } from '../urs/getSystemToken'
import { getClientId } from '../../../../sharedUtils/config'

let cmrToken = null

/**
 * CMR has a maximum page size of 2000, this method will automatically page through all results regardless of how many there are
 * @param {String} path The pat of the endpoint to get results from
 * @param {Object} queryParams An object that will represent the query parameters in the url
 * @return {Array} An array representing all results from CMR
 */
export const pageAllCmrResults = async (path, queryParams = {}) => {
  const pageSize = 500

  try {
    cmrToken = await getSystemToken(cmrToken)

    // Default parameters that we need to send CMR to ensure correct paging
    const cmrParams = Object.assign(queryParams, {
      page_size: pageSize
    })

    // Make an initial request so that we can get cmr-hits from the header, this
    // will help determine how many additional requests we'll need to make to get
    // all of the results
    const cmrResponse = await request.get({
      uri: cmrUrl(path, cmrParams),
      headers: {
        'Client-Id': getClientId('prod').background,
        'Echo-Token': cmrToken
      },
      json: true,
      resolveWithFullResponse: true
    })

    // Initialize the array that will contain all of the results from CMR with the
    // body from the first request
    const allResults = readCmrResults(path, cmrResponse)

    // Stats to determine how many total pages we'll need to loop through to
    // retrieve all the results from CMR
    const totalCmrHits = cmrResponse.headers['cmr-hits']
    const totalPages = Math.ceil(totalCmrHits / cmrParams.page_size)

    if (totalPages > 1) {
      await Array.from(Array(totalPages - 1)).forEachAsync(async (_, k) => {
        cmrParams.page_num = k + 2

        const additionalCmrResponse = await request.get({
          uri: cmrUrl(path, cmrParams),
          headers: {
            'Client-Id': getClientId('prod').background,
            'Echo-Token': cmrToken
          },
          json: true,
          resolveWithFullResponse: true
        })

        allResults.push(...readCmrResults(path, additionalCmrResponse))
      })
    }

    return allResults
  } catch (e) {
    console.log(e)

    return e
  }
}
