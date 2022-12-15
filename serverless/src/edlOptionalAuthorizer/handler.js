import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { generatePolicy } from '../util/authorizer/generatePolicy'
import { validateToken } from '../util/authorizer/validateToken'
import { downcaseKeys } from '../util/downcaseKeys'

/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlOptionalAuthorizer = async (event) => {
  const {
    headers = {},
    methodArn,
    requestContext = {}
  } = event

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const { authorization: authorizationToken = '' } = downcaseKeys(headers)

  // resourcePath contains the path assigned to the lambda being requested
  const { resourcePath } = requestContext

  // authorizationToken comes in as `Bearer asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = authorizationToken.split(' ')
  const jwtToken = tokenParts[1]

  // Authorization header must exist for API Gateway to execute this authorizer, but if the user isn't logged in,
  // the header will be `Bearer `
  if (!jwtToken || jwtToken === '') {
    const authOptionalPaths = [
      '/autocomplete',
      '/opensearch/granules',
      '/collections/export'
    ]

    // Allow for optional authentication
    if (authOptionalPaths.includes(resourcePath)) {
      return generatePolicy('anonymous', undefined, 'Allow', methodArn)
    }

    console.log(`${resourcePath} does not support optional authentication.`)

    throw new Error('Unauthorized')
  }

  const username = await validateToken(jwtToken, earthdataEnvironment)

  if (username) {
    return generatePolicy(username, jwtToken, 'Allow', methodArn)
  }

  throw new Error('Unauthorized')
}

export default edlOptionalAuthorizer
