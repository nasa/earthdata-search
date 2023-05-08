import AWS from 'aws-sdk'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getS3Config } from '../util/aws/getS3Config'
import { getSearchExportBucket } from '../util/aws/getSearchExportBucket'
import { getDbConnection } from '../util/database/getDbConnection'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import doesObjectExist from '../util/aws/doesObjectExist'

// AWS S3 adapter
let s3

/**
 * Check if Search Export is Ready for Download.
 * If it is, return a signed URL.
 * @param {Object} event Details about the HTTP request that it received
 */
const exportSearchCheck = async (event, context) => {
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

  s3 ??= new AWS.S3(getS3Config())

  const { body, headers } = event

  if (!body) throw Error('Post did not include a body')

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const jwt = getJwtToken(event)

  const userId = jwt ? getVerifiedJwtToken(jwt, earthdataEnvironment).id : undefined

  // adding a little extra validation
  if (body.length > 1000) throw Error('Body is too long')

  const { requestId, data } = JSON.parse(body)

  const { key } = data
  console.log(`Lambda exportSearchCheck requestId="${requestId}" userId="${userId || 'anonymous'}" key="${key}"`)

  if (!key) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      headers: {
        ...defaultResponseHeaders,
        'jwt-token': jwt
      },
      body: JSON.stringify({ errors: ['Missing key'] })
    }
  }

  const dbConnection = await getDbConnection()

  const rows = await dbConnection('exports').where({ key })
  if (rows.length !== 1) {
    throw Error(`Expected only one row with key "${key}", but instead saw ${rows.length} matches`)
  }

  const { state } = rows[0]

  if (state !== 'DONE') {
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {
        ...defaultResponseHeaders,
        'jwt-token': jwt
      },
      body: JSON.stringify({ state })
    }
  }

  const searchExportBucket = getSearchExportBucket()
  if (!searchExportBucket) throw Error('Failed to get bucket name')

  const exists = await doesObjectExist(s3, searchExportBucket, key)
  if (!exists) {
    return {
      isBase64Encoded: false,
      statusCode: 400,
      headers: {
        ...defaultResponseHeaders,
        'jwt-token': jwt
      },
      body: JSON.stringify({ errors: ["Export should be ready, but we can't find it"] })
    }
  }

  const signedUrl = await s3.getSignedUrlPromise('getObject', {
    Bucket: searchExportBucket,
    Key: key,
    Expires: 10 * 60 // pre-signed URL expires after 10 minutes
  })
  if (!signedUrl) throw Error('Failed to get signed url')

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
      ...defaultResponseHeaders,
      'jwt-token': jwt
    },
    body: JSON.stringify({ state, url: signedUrl })
  }
}

export default exportSearchCheck
