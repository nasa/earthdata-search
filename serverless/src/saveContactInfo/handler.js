import axios from 'axios'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Handler for saving a users contact info
 */
const saveContactInfo = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body, headers } = event
  const { params, requestId } = JSON.parse(body)

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const jwtToken = getJwtToken(event)

  const { id } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const userRecord = await dbConnection('users')
      .first(
        'urs_id'
      )
      .where({
        id
      })

    const {
      urs_id: ursId
    } = userRecord

    const orderingUrl = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/ordering/api`

    const {
      access_token: authToken
    } = await getAccessTokenFromJwtToken(jwtToken, earthdataEnvironment)

    const cmrQuery = `
    mutation updateUser (
      $ursId: String!,
      $notificationLevel: NotificationLevel!
    ) {
      updateUser (
        ursId: $ursId,
        notificationLevel: $notificationLevel
      ) {
        ursId
        notificationLevel
      }
    }`

    const requestHeaders = {
      Authorization: `Bearer ${authToken}`,
      'Client-Id': getClientId().lambda,
      'X-Request-Id': requestId
    }

    const cmrPreferencesResponse = await axios({
      url: orderingUrl,
      method: 'post',
      data: {
        variables: {
          ursId,
          ...params.preferences
        },
        query: cmrQuery
      },
      headers: requestHeaders
    })

    const { status, data, errors } = cmrPreferencesResponse

    if (errors) throw new Error(JSON.stringify(errors))

    const { updateUser } = data.data

    return {
      isBase64Encoded: false,
      statusCode: status,
      headers: defaultResponseHeaders,
      body: JSON.stringify(updateUser)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default saveContactInfo
