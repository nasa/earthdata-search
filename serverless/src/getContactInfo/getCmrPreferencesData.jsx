import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve CMR-ordering preferences data for the provided username
 * @param {String} username The CMR username to lookup
 * @param {String} token A valid URS access token
 * @param {String} environment The CMR environment in use
 */
export const getCmrPreferencesData = async (username, token, environment) => {
  const cmrQuery = `
    query User(
      $ursId: String!
    ) {
      user(
        ursId: $ursId
      ) {
        ursId
        notificationLevel
      }
    }`

  const { cmrHost } = getEarthdataConfig(environment)

  const orderingUrl = `${cmrHost}/ordering/api`

  const requestId = uuidv4()

  const requestHeaders = {
    Authorization: `Bearer ${token}`,
    'Client-Id': getClientId().lambda,
    'X-Request-Id': requestId
  }

  const cmrPreferencesResponse = await axios({
    url: orderingUrl,
    method: 'post',
    data: {
      variables: {
        ursId: username
      },
      query: cmrQuery
    },
    headers: requestHeaders
  })

  return cmrPreferencesResponse
}
