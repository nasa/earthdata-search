import AWS from 'aws-sdk'
import request from 'request-promise'
import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getEarthdataConfig, getClientId } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { logHttpError } from '../util/logging/logHttpError'

// AWS SQS adapter
let sqs

/**
 * Handler for saving a users contact info
 */
const saveContactInfo = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

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
      const errors = logHttpError(e)

      return {
        isBase64Encoded: false,
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ errors })
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(response.body)
    }
  } catch (e) {
    console.log(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default saveContactInfo
