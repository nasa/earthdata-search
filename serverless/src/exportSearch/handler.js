import crypto from 'node:crypto'

import AWS from 'aws-sdk'
import axios from 'axios'
import { get } from 'sendero';

import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { jsonToCsv } from '../util/jsonToCsv'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

// AWS S3 adapter
let s3

/**
 * Perform a loop through collection results and return the full results in the requested format.
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearch = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const dbConnection = await getDbConnection()

  // we set the concurrency to 1, so we only process one at a time
  // this way, if there's an issue, we can retry only the one that failed
  const { Records: [sqsRecord] } = event

  if (!sqsRecord) return

  const { body } = sqsRecord

  const { extra, params } = JSON.parse(body)

  const { earthdataEnvironment, filename, key, jwt, requestId, userId } = extra
  if (!filename) throw new Error("missing filename")
  if (!key) throw new Error("missing key")
  if (!requestId) throw new Error("missing requestId")
  if (!userId) throw new Error("missing userId")

  if ((await dbConnection('exports').where({ user_id: userId, key })).length !== 1) {
    throw Error("invalid number of rows matching user_id and key")
  }

  await dbConnection('exports').where({ user_id: userId, key }).update({ state: "PROCESSING" }).returning(['user_id', 'key'])

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

  const { columns, cursorpath, format, itempath, query, variables } = params;

  const graphQlUrl = `${graphQlHost}/api`

  let cursor
  let finished = false
  const returnItems = []
  let responseHeaders

  // Loop until the request comes back with no items
  while (!finished) {
    // We need this await inside the loop because we have to wait on the response from the previous
    // call before making the next request
    // eslint-disable-next-line no-await-in-loop
    const response = await wrappedAxios({
      url: graphQlUrl,
      method: 'post',
      data: {
        query,
        variables: {
          ...variables,
          cursor
        }
      },
      headers: requestHeaders
    })

    const {
      data: responseData,
      config
    } = response;
    ({ headers: responseHeaders, status } = response)

    const { elapsedTime } = config

    const { data } = responseData;

    const responseCursor = get(data, cursorpath)[0];

    const items = get(data, itempath, { clean: true })

    console.log(`Request for ${items.length} exportSearch collections successfully completed in ${elapsedTime} ms`)

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
  let returnBody, contentType
  if (format === 'json') {
    returnBody = JSON.stringify(returnItems)
    contentType = 'application/json'
  } else if (format === 'csv') {
    returnBody = jsonToCsv(returnItems, columns)
    contentType = 'text/csv'
  } else {
    throw new Error("invalid format")
  }

  s3 ??= new AWS.S3({
    endpoint: process.env.searchExportS3Endpoint
  })

  if (!process.env.IS_OFFLINE) {
    await s3.upload({
      Bucket: process.env.searchExportBucket,
      Key: key,
      Body: returnBody,
      ACL: 'authenticated-read',
      ContentDisposition: `attachment; filename="${filename}"`,
      ContentType: contentType,

      // Content-MD5 recommended by https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      ContentMD5: crypto.createHash("md5").update(returnBody).digest("base64")
    }).promise()
    console.log(`uploaded object to bucket "${process.env.searchExportBucket}" with key "${key}"`)

    await dbConnection('exports').where({ user_id: userId, key }).update({ state: "DONE" })
    console.log('updated export status in the database')
  }
}

export default exportSearch
