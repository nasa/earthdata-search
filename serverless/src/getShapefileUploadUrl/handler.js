import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { getS3Client } from '../util/getS3Client'
import { parseError } from '../../../sharedUtils/parseError'

// AWS S3 adapter
let s3

// Number of seconds the presigned URL is valid for
const URL_EXPIRATION_SECONDS = 300

/**
 * Generates a presigned S3 URL that the client can use to upload a shapefile
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getShapefileUploadUrl = async (event, context) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (s3 == null) {
    s3 = getS3Client()
  }

  const { defaultResponseHeaders } = getApplicationConfig()

  const {
    SHAPEFILE_UPLOAD_BUCKET_NAME: bucketName = 'earthdata-search-dev-shapefile-uploads'
  } = process.env

  try {
    const { body } = event

    const { params = {} } = JSON.parse(body || '{}')

    const {
      contentType = 'application/octet-stream',
      filename
    } = params

    if (!filename) {
      return {
        isBase64Encoded: false,
        statusCode: 400,
        headers: defaultResponseHeaders,
        body: JSON.stringify({ errors: ['A filename is required.'] })
      }
    }

    // Strip any path segments and unsafe characters from the provided filename,
    // and prefix with a UUID to avoid collisions between uploads
    const sanitizedFilename = filename
      .split(/[\\/]/)
      .pop()
      .replace(/[^a-zA-Z0-9._-]/g, '_')

    const key = `${crypto.randomUUID()}/${sanitizedFilename}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType
    })

    const url = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRATION_SECONDS })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        expiresIn: URL_EXPIRATION_SECONDS,
        key,
        url
      })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default getShapefileUploadUrl
