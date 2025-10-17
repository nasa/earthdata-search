import { getApplicationConfig } from '../../../../sharedUtils/config'
import { validateToken } from '../../util/authorizer/validateToken'
import { downcaseKeys } from '../../util/downcaseKeys'
import getLoaders from './getLoaders'
import DatabaseClient from './databaseClient'

const { env } = getApplicationConfig()

const databaseClient = new DatabaseClient()

const loaders = getLoaders({ databaseClient })

/**
 * Gets the context for the GraphQL resolver
 * @param {Object} params The parameters for the context
 * @param {Object} params.event The event object from the lambda function
 * @param {Object} params.context The context object from the lambda function
 * @returns {Object} The context object
 */
const getContext = async ({ event }) => {
  const { headers } = event

  const {
    authorization: bearerToken = ''
  } = downcaseKeys(headers)

  const { userId } = await validateToken(bearerToken.split(' ')[1], env)

  let user

  // If a userId was returned, get the user from the database
  if (userId) user = await databaseClient.getUserById(userId)

  return {
    databaseClient,
    bearerToken,
    loaders,
    user
  }
}

export default getContext
