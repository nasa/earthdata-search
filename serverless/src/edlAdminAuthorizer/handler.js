import { getAdminUsers } from '../util/getAdminUsers'
import { generatePolicy } from '../util/authorizer/generatePolicy'
import { validateToken } from '../util/authorizer/validateToken'

/**
 * Custom authorizer for API Gateway authentication for the admin routes
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAdminAuthorizer = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const {
    authorizationToken = '',
    methodArn
  } = event

  // authorizationToken comes in as `Bearer: asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = authorizationToken.split(' ')
  const jwtToken = tokenParts[1]

  const username = await validateToken(jwtToken)

  if (username) {
    let adminUsers
    try {
      adminUsers = await getAdminUsers()
    } catch (e) {
      adminUsers = []
    }

    if (adminUsers.includes(username)) {
      return generatePolicy(username, jwtToken, 'Allow', methodArn)
    }
  }

  console.log(`${username} is not authorized to access the site admin.`)

  throw new Error('Unauthorized')
}

export default edlAdminAuthorizer
