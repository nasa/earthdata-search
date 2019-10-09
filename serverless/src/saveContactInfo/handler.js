import request from 'request-promise'

import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getEarthdataConfig, getClientId } from '../../../sharedUtils/config'
import cmrEnv from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { invokeLambda } from '../util/aws/invokeLambda'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'

/**
 * Handler for saving a users contact info
 */
const saveContactInfo = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const jwtToken = getJwtToken(event)
  const { id } = getVerifiedJwtToken(jwtToken)
  const { access_token: accessToken } = await getAccessTokenFromJwtToken(jwtToken)

  const { body } = event
  const { params } = JSON.parse(body)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const userRecord = await dbConnection('users')
      .first(
        'echo_id',
        'urs_id'
      )
      .where({
        id
      })

    const {
      echo_id: echoId,
      urs_id: userId
    } = userRecord

    const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/users/${echoId}/preferences.json`

    const response = await request.put({
      uri: url,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': await getEchoToken(jwtToken)
      },
      body: params,
      json: true,
      resolveWithFullResponse: true
    })

    // Invoke the Lambda to update the authenticated users' data in our database
    await invokeLambda(process.env.storeUserLambda, {
      username: userId,
      token: accessToken
    })

    return {
      isBase64Encoded: false,
      statusCode: response.statusCode,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(response.body)
    }
  } catch (error) {
    console.log('saveContactInfo error', error)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [error] })
    }
  }
}

export default saveContactInfo
