import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform an NLP search request to CMR
 * @param {Object} event Details about the HTTP request that it received
 */
const nlpSearch = async (event) => {
  console.log('🚀 NLP Search Lambda handler called')
  console.log('🚀 Event:', JSON.stringify(event, null, 2))

  const { body, headers } = event

  const { params, requestId } = JSON.parse(body)

  console.log('🚀 Parsed params:', params)
  console.log('🚀 Request ID:', requestId)

  const { defaultResponseHeaders } = getApplicationConfig()

  // Always use SIT environment since NLP endpoint only exists there
  const earthdataEnvironment = 'sit'
  console.log('🚀 Using earthdata environment:', earthdataEnvironment)

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

    console.log('🚀 Built params for CMR request:', builtParams)

    // NLP search doesn't require authentication for logging purposes
    const jwtToken = getJwtToken(event)
    console.log('🚀 JWT Token:', jwtToken ? 'present' : 'not present')

    const results = await doSearchRequest({
      jwtToken: jwtToken || null, // Allow null JWT token for unauthenticated requests
      method: 'get',
      path: '/search/nlp/query.json',
      params: builtParams,
      requestId,
      earthdataEnvironment
    })

    console.log(`🚀 NLP Search Params: ${JSON.stringify(params)}, Results: ${results.body}`)

    // Add CORS headers to the response
    const finalResponse = {
      ...results,
      headers: {
        ...results.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Access-Control-Request-Headers,Access-Control-Request-Methods,Authorization,Client-Id,Content-Type,Earthdata-ENV,Origin,User-Agent,X-Amz-Date,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id,X-Api-Key,X-Request-Id',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      }
    }

    console.log('🚀 Final NLP response headers:', finalResponse.headers)
    console.log('🚀 Final NLP response status:', finalResponse.statusCode)

    return finalResponse
  } catch (error) {
    console.error('🚀 NLP search error:', error)

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
