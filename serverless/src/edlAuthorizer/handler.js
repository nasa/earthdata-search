import { generatePolicy } from '../util/authorizer/generatePolicy'
import { validateToken } from '../util/authorizer/validateToken'


/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAuthorizer = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const {
    authorizationToken,
    methodArn,
    requestContext = {}
  } = event
  const { resourcePath } = requestContext

  if (!authorizationToken) {
    const authOptionalPaths = [
      'autocomplete',
      '/cwic/granules'
    ]

    // Allow for optional authentication
    if (authOptionalPaths.includes(resourcePath)) {
      return generatePolicy('anonymous', undefined, 'Allow', methodArn)
    }

    throw new Error('Unauthorized')
  }

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
