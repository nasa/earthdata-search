import AWS from 'aws-sdk'
import request from 'request-promise'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

// AWS SQS adapter
let sqs

/**
 * Handler for saving a users contact info
 */
const saveContactInfo = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { body, headers } = event
  const { params } = JSON.parse(body)

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const jwtToken = getJwtToken(event)

  const { id } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

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

    const url = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/legacy-services/rest/users/${echoId}/preferences.json`

    const echoToken = await getEchoToken(jwtToken, earthdataEnvironment)

    const response = await request.put({
      uri: url,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': echoToken
      },
      body: params,
      json: true,
      resolveWithFullResponse: true
    })

    if (process.env.IS_OFFLINE) {
      await sqs.sendMessage({
        QueueUrl: process.env.userDataQueueUrl,
        MessageBody: JSON.stringify({
          environment: earthdataEnvironment,
          userId: id,
          username: userId
        })
      }).promise()
    }

    const { body, statusCode } = response

    return {
      isBase64Encoded: false,
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify(body)
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
