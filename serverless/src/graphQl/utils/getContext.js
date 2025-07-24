import { getApplicationConfig } from '../../../../sharedUtils/config'
import { validateToken } from '../../util/authorizer/validateToken'
import { downcaseKeys } from '../../util/downcaseKeys'
import DatabaseClient from './databaseClient'

const { env } = getApplicationConfig()

const databaseClient = new DatabaseClient()

const getContext = async ({ event }) => {
  const { headers } = event

  const {
    authorization: bearerToken
  } = downcaseKeys(headers)

  const { userId } = await validateToken(bearerToken.split(' ')[1], env)

  const user = await databaseClient.getUserById(userId) || {}

  return {
    databaseClient,
    bearerToken,
    user
  }
}

export default getContext
