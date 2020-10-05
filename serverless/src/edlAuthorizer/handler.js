import { generatePolicy } from '../util/authorizer/generatePolicy'
import { validateToken } from '../util/authorizer/validateToken'

/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAuthorizer = async (event) => {
  const {
    authorizationToken = '',
    methodArn
  } = event

  // authorizationToken comes in as `Bearer: asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = authorizationToken.split(' ')
  const jwtToken = tokenParts[1]

  const username = await validateToken(jwtToken)

  if (username) {
    return generatePolicy(username, jwtToken, 'Allow', methodArn)
  }

  throw new Error('Unauthorized')
}

export default edlAuthorizer
