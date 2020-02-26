import AWS from 'aws-sdk'
import request from 'request-promise'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getEarthdataConfig, getClientId, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { parseError } from '../util/parseError'

// AWS SQS adapter
let sqs

/**
 * Handler for saving a users contact info
 */
const saveContactInfo = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const jwtToken = getJwtToken(event)
  const { id } = getVerifiedJwtToken(jwtToken)

  const { body } = event
  const { params } = JSON.parse(body)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

  try {
    const cmrEnvironment = cmrEnv()

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

    const url = `${getEarthdataConfig(cmrEnvironment).cmrHost}/legacy-services/rest/users/${echoId}/preferences.json`

    let response
    try {
      response = await request.put({
        uri: url,
        headers: {
          'Client-Id': getClientId().lambda,
          'Echo-Token': await getEchoToken(jwtToken)
        },
        body: params,
        json: true,
        resolveWithFullResponse: true
      })
    } catch (e) {
      return {
        isBase64Encoded: false,
        headers: defaultResponseHeaders,
        ...parseError(e)
      }
    }

    await sqs.sendMessage({
      QueueUrl: process.env.userDataQueueUrl,
      MessageBody: JSON.stringify({
        environment: cmrEnvironment,
        userId: id,
        username: userId
      })
    }).promise()

    return {
      isBase64Encoded: false,
      statusCode: response.statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify(response.body)
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
