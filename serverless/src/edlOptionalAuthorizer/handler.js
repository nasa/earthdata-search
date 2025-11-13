import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { generatePolicy } from '../util/authorizer/generatePolicy'
import { validateToken } from '../util/authorizer/validateToken'
import { downcaseKeys } from '../util/downcaseKeys'
import { getDbConnection } from '../util/database/getDbConnection'

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

  // `resourcePath` contains the path assigned to the lambda being requested
  const { resourcePath } = requestContext

  // `authorizationToken` comes in as `Bearer asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = authorizationToken.split(' ')
  const jwtToken = tokenParts[1]

  // Authorization header must exist for API Gateway to execute this authorizer, but if the user isn't logged in,
  // the header will be `Bearer `
  if (!jwtToken || jwtToken === '') {
    const authOptionalPaths = [
      '/autocomplete',
      '/opensearch/granules',
      '/collections/export',
      '/generateNotebook'
    ]

    // Allow for optional authentication
    if (authOptionalPaths.includes(resourcePath)) {
      return generatePolicy({
        earthdataEnvironment,
        effect: 'Allow',
        jwtToken,
        resource: methodArn,
        username: 'anonymous'
      })
    }

    console.log(`${resourcePath} does not support optional authentication.`)

    throw new Error('Unauthorized')
  }

  const { username } = await validateToken(jwtToken, earthdataEnvironment)

  if (username) {
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const { id: userId } = await dbConnection('users').where({
      environment: earthdataEnvironment,
      urs_id: username
    }).first()

    return generatePolicy({
      earthdataEnvironment,
      effect: 'Allow',
      jwtToken,
      resource: methodArn,
      userId,
      username
    })
  }

  throw new Error('Unauthorized')
}

export default edlOptionalAuthorizer
