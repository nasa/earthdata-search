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
 * @param {*} params The parameters for the context
 * @returns The context object
 */
const getContext = async ({ event }) => {
  const { headers } = event

  const {
    authorization: bearerToken
  } = downcaseKeys(headers)

  const { userId } = await validateToken(bearerToken.split(' ')[1], env)

  const user = await databaseClient.getUserById(userId)

  return {
    databaseClient,
    bearerToken,
    loaders,
    user
  }
}

export default getContext
