import crypto from 'node:crypto'

import AWS from 'aws-sdk'
import axios from 'axios'
import { get } from 'sendero'

import { getEarthdataConfig } from '../../../sharedUtils/config'
import doesBucketExist from '../util/aws/doesBucketExist'
import { getS3Config } from '../util/aws/getS3Config'
import { getSearchExportBucket } from '../util/aws/getSearchExportBucket'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEchoToken } from '../util/urs/getEchoToken'
import retry from '../util/retry'
import { jsonToCsv } from '../util/jsonToCsv'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

// AWS S3 adapter
let s3

/**
 * Perform a loop through collection results and upload the full results in the requested format to S3
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearch = async (event, context) => {
  try {
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

    const dbConnection = await getDbConnection()

    // we set the concurrency to 1 in aws-functions.yml, so we only process one at a time
    // this way, if there's an issue, we can retry only the one that failed
    const sqsRecord = event.Records[0]

    if (!sqsRecord) return

    const { body } = sqsRecord

    const { extra, params } = JSON.parse(body)

    const {
      earthdataEnvironment,
      filename,
      key,
      jwt,
      requestId,
      userId
    } = extra

    if (!filename) throw new Error('SQS Message body missing extra.filename')
    if (!key) throw new Error('SQS Message body missing extra.key')
    console.log(`Lambda exportSearch creating export with filename="${filename}" key="${key}" requestId="${requestId}" userId="${userId || 'anonymous'}"`)

    const updateState = (state) => dbConnection('exports').where({ key }).update({ state })

    const matches = await dbConnection('exports').where({ key })

    if (matches.length !== 1) {
      await updateState('FAILED')
      throw Error(`expected only one row to match key "${key}", but instead saw ${matches.length} matches`)
    }

    await updateState('PROCESSING')

    // create request header for X-Request-Id
    // so we can track a request across applications
    const requestHeaders = {
      'X-Request-Id': requestId
    }

    if (jwt) {
      // Support endpoints that have optional authentication
      const token = await getEchoToken(jwt, earthdataEnvironment)

      requestHeaders.Authorization = `Bearer ${token}`
    }

    const { graphQlHost } = getEarthdataConfig(earthdataEnvironment)

    const {
      columns, cursorPath, format, itemPath, query, variables
    } = params

    const graphQlUrl = `${graphQlHost}/api`

    let cursor
    let finished = false
    const returnItems = []

    // Loop until the request comes back with no items
    while (!finished) {
      // We need to use await inside the loop because we have to wait on the response from the previous
      // call before making the next request
      // eslint-disable-next-line no-await-in-loop

      let response

      const options = {
        url: graphQlUrl,
        method: 'post',
        data: {
          query,
          variables: {
            ...variables,
            params: {
              ...variables.params,
              cursor
            }
          }
        },
        headers: requestHeaders
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        response = await retry(() => wrappedAxios(options), { attempts: 3, backoff: 5 })
      } catch (error) {
        // eslint-disable-next-line no-await-in-loop
        await updateState('FAILED')
        throw error
      }

      const {
        data: responseData,
        config
      } = response

      const { elapsedTime } = config

      const { data } = responseData

      const responseCursor = get(data, cursorPath)[0]

      const items = get(data, itemPath, { clean: true })

      console.log(`Inside exportSearch Lambda, Request "${requestId}" for ${items.length} exportSearch collections successfully completed in ${elapsedTime} ms`)

      // Set the cursor returned from GraphQl so the next loop will use it
      cursor = responseCursor

      // If there are no items returned, set finished to true to exit the loop
      if (!items || !items.length) {
        finished = true
        break
      }

      // Push the items returned onto the returnItems array
      returnItems.push(...items)
    }

    // Format the returnItems into the requested format
    let returnBody; let
      contentType
    if (format === 'json') {
      returnBody = JSON.stringify(returnItems)
      contentType = 'application/json'
    } else if (format === 'csv') {
      returnBody = jsonToCsv(returnItems, columns)
      contentType = 'text/csv'
    } else {
      throw new Error('invalid format')
    }

    s3 ??= new AWS.S3(getS3Config())

    const searchExportBucket = getSearchExportBucket()

    if (!(await doesBucketExist(s3, searchExportBucket))) {
      await updateState('FAILED')
      throw Error(`bucket with name "${searchExportBucket}" does not exist`)
    }

    await s3.upload({
      Bucket: searchExportBucket,
      Key: key,
      Body: returnBody,
      ACL: 'authenticated-read',
      ContentDisposition: `attachment; filename="${filename}"`,
      ContentType: contentType,

      // Content-MD5 recommended by https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      ContentMD5: crypto.createHash('md5').update(returnBody).digest('base64')
    }).promise()
    console.log(`For request "${requestId}", uploaded object to bucket "${searchExportBucket}" with key "${key}"`)

    await updateState('DONE')
  } catch (error) {
    console.error('\n\n\nThe following error was thrown in exportSearch Lambda:', error)
  }
}

export default exportSearch
