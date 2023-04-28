import { getJwtToken } from './getJwtToken'
import { getVerifiedJwtToken } from './getVerifiedJwtToken'

export const getUserId = (event, earthdataEnvironment) => {
  const jwt = getJwtToken(event)

  if (!jwt) return undefined

  const verified = getVerifiedJwtToken(jwt, earthdataEnvironment)

  if (!verified) return undefined

  return verified.userId
}
