import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { generatePolicy } from '../util/authorizer/generatePolicy'
import { validateToken } from '../util/authorizer/validateToken'

/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAuthorizer = async (event) => {
  const {
    headers = {},
    methodArn
  } = event
  console.log('edlAuthorizer')
  const earthdataEnvironment = determineEarthdataEnvironment(headers)
  console.log(`Env: ${JSON.stringify(earthdataEnvironment, null, 2)}`)
  const { authorization: authorizationToken = '' } = headers

  // authorizationToken comes in as `Bearer asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = authorizationToken.split(' ')
  const jwtToken = tokenParts[1]
  console.log(`jwtToken: ${jwtToken}`)

  const username = await validateToken(jwtToken, earthdataEnvironment)

  if (username) {
    console.log(`Username: ${username}`)
    return generatePolicy(username, jwtToken, 'Allow', methodArn)
  }
  console.log('Unable to extract username')
  throw new Error('Unauthorized')
}

export default edlAuthorizer
