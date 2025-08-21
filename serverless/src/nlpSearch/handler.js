import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform an NLP search request to CMR
 * @param {Object} event Details about the HTTP request that it received
 */
const nlpSearch = async (event) => {
  const { body } = event

  const { requestId } = JSON.parse(body)
  const { defaultResponseHeaders } = getApplicationConfig()

  // Always use SIT environment since NLP endpoint only exists there
  const earthdataEnvironment = 'sit'

  const permittedCmrKeys = [
    'q'
  ]

  const nonIndexedKeys = []

  try {
    const builtParams = buildParams({
      body,
      permittedCmrKeys,
      nonIndexedKeys,
      stringifyResult: false
    })

    const jwtToken = getJwtToken(event)

    const results = await doSearchRequest({
      jwtToken: jwtToken || null,
      method: 'get',
      path: '/search/nlp/query.json',
      params: builtParams,
      requestId,
      earthdataEnvironment
    })

    const finalResponse = {
      ...results,
      headers: {
        ...results.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Access-Control-Request-Headers,Access-Control-Request-Methods,Authorization,Client-Id,Content-Type,Earthdata-ENV,Origin,User-Agent,X-Amz-Date,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id,X-Api-Key,X-Request-Id',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      }
    }

    return finalResponse
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {
        ...defaultResponseHeaders,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Access-Control-Request-Headers,Access-Control-Request-Methods,Authorization,Client-Id,Content-Type,Earthdata-ENV,Origin,User-Agent,X-Amz-Date,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id,X-Api-Key,X-Request-Id',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      ...parseError(error)
    }
  }
}

export default nlpSearch
