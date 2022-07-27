import axios from 'axios'
import moment from 'moment'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { getUrsSystemCredentials } from './getUrsSystemCredentials'
import { getDbConnection } from '../database/getDbConnection'
import { deleteSystemToken } from './deleteSystemToken'

/**
 * Returns a token from EDL for the system user
 * @param {String} earthdataEnvironment The Earthdata Environment to retrieve a token from
 */
export const getSystemToken = async () => {
  const earthdataEnvironment = deployedEnvironment()

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  // Fetch the system token
  const systemTokenRecord = await dbConnection('system_token')
    .first(['id', 'token', 'created_at'])

  const {
    id: tokenId,
    token,
    created_at: createdAt
  } = systemTokenRecord || {}

  // If no system token exists, or the token is older than a day, fetch a few token
  // Tokens last longer than a day, but retrieving a new token every day ensures it doesn't expire and
  // break the background jobs
  const oneDayAgo = moment().subtract(1, 'days')

  if (!token || createdAt < oneDayAgo) {
    // Revoke the previous system token
    if (token) deleteSystemToken(token)

    const { edlHost } = getEarthdataConfig(earthdataEnvironment)
    const ursSystemUserCredentials = await getUrsSystemCredentials(earthdataEnvironment)
    const {
      username,
      password
    } = ursSystemUserCredentials

    // Base 64 encode the credentials
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')

    const url = `${edlHost}/api/users/token`

    let ursResponse
    try {
      ursResponse = await axios({
        method: 'post',
        url,
        headers: {
          Authorization: `Basic ${credentials}`
        }
      })
    } catch (error) {
      console.log('Error retrieving token', error)
      return null
    }

    const { data } = ursResponse
    const { access_token: accessToken } = data

    console.log(`Successfully retrieved a ${earthdataEnvironment.toUpperCase()} token for '${username}'`)

    // Update the token in the database
    await dbConnection('system_token')
      .insert({
        id: tokenId,
        token: accessToken,
        created_at: new Date()
      })
      .onConflict('id')
      .merge()

    // The actual token is returned as `accessToken`
    return accessToken
  }

  // If the token is less than a day old, return the token
  console.log('Retrieved existing system token')
  return token
}
