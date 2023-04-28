import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import getSearchExportQueueUrl from '../util/aws/getSearchExportQueueUrl'
import { parseError } from '../../../sharedUtils/parseError'

// adapter for Amazon Simple Queue Service (SQS)
let sqs

/**
 * @description Request an export from cmr-graphql
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearchRequest = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (process.env.IS_OFFLINE) {
    // fake/mock values when doing local development
    AWS.config.update({
      accessKeyId: 'MOCK_ACCESS_KEY_ID',
      secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
      region: 'us-east-1'
    })
  }

  sqs ??= new AWS.SQS(getSqsConfig())

  const { body, headers } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const jwt = getJwtToken(event)

    const userId = jwt ? getVerifiedJwtToken(jwt, earthdataEnvironment).id : undefined

    const { data, requestId } = JSON.parse(body)

    const {
      columns, cursorpath, format = 'json', itempath, query, variables
    } = data

    if (!['csv', 'json'].includes(format)) throw Error('invalid or missing format')

    const params = {
      columns,
      cursorpath,
      format,
      itempath,
      query,
      variables
    }

    const key = uuidv4()

    const filename = `search_results_export_${key.split('-')[0]}.${format}`

    const extra = {
      earthdataEnvironment,
      key,
      filename,
      jwt,
      requestId,
      userId
    }

    const message = { params, extra }

    const messageBody = JSON.stringify(message)

    const dbConnection = await getDbConnection()

    await dbConnection('exports').insert({
      user_id: userId,
      key,
      state: 'REQUESTED',
      filename
    })

    const searchExportQueueUrl = getSearchExportQueueUrl()
    console.log('searchExportQueueUrl:', JSON.stringify(searchExportQueueUrl))

    await sqs.sendMessage({
      QueueUrl: searchExportQueueUrl,
      MessageBody: messageBody
    }).promise()

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {
        ...defaultResponseHeaders,
        ...(jwt ? { 'jwt-token': jwt } : {})
      },
      body: JSON.stringify({
        key
      })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default exportSearchRequest
