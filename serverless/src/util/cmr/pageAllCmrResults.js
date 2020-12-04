import 'array-foreach-async'
import { stringify } from 'qs'
import request from 'request-promise'
import { readCmrResults } from './readCmrResults'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { getClientId } from '../../../../sharedUtils/getClientId'

/**
 * CMR has a maximum page size of 2000, this method will automatically page through all results regardless of how many there are
 * @param {String} path The pat of the endpoint to get results from
 * @param {Object} queryParams An object that will represent the query parameters in the url
 * @return {Array} An array representing all results from CMR
 */
export const pageAllCmrResults = async ({
  cmrToken,
  deployedEnvironment,
  path,
  queryParams = {},
  additionalHeaders = {}
}) => {
  const pageSize = 500

  try {
    // Default parameters that we need to send CMR to ensure correct paging
    const cmrParams = {
      ...queryParams,
      page_size: pageSize
    }

    // Make an initial request so that we can get cmr-hits from the header, this
    // will help determine how many additional requests we'll need to make to get
    // all of the results
    const { cmrHost } = getEarthdataConfig(deployedEnvironment)

    const response = await request.post({
      uri: `${cmrHost}/${path}`,
      form: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
      headers: {
        'Client-Id': getClientId().background,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Echo-Token': cmrToken,
        ...additionalHeaders
      },
      json: true,
      resolveWithFullResponse: true
    })

    // Initialize the array that will contain all of the results from CMR with the
    // body from the first request
    const allResults = readCmrResults(path, response)

    // Stats to determine how many total pages we'll need to loop through to
    // retrieve all the results from CMR
    const totalCmrHits = parseInt(response.headers['cmr-hits'], 10)

    const totalPages = Math.ceil(totalCmrHits / cmrParams.page_size)

    console.log(`Paging ${totalCmrHits} CMR Results (${totalPages} page(s) based on provided parameters)`)

    if (totalPages > 1) {
      await Array.from(Array(totalPages - 1)).forEachAsync(async (_, k) => {
        cmrParams.page_num = k + 2

        console.log(`Retrieving page ${cmrParams.page_num}...`)

        const additionalCmrResponse = await request.post({
          uri: `${cmrHost}/${path}`,
          form: stringify(cmrParams, { indices: false, arrayFormat: 'brackets' }),
          headers: {
            'Client-Id': getClientId().background,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Echo-Token': cmrToken,
            ...additionalHeaders
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
