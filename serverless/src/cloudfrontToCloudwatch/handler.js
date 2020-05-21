import util from 'util'
import zlib from 'zlib'

import 'array-foreach-async'

import AWS from 'aws-sdk'

import { parseError } from '../../../sharedUtils/parseError'

// Promisify node method
const gunzip = util.promisify(zlib.gunzip)

let s3

/**
 * Process provided Cloudwatch logs triggered by S3
 * @param {Object} event Details about the S3 event
 */
const cloudfrontToCloudwatch = async (event) => {
  const { Records: s3Records = [] } = event

  if (s3Records.length === 0) return

  console.log(`Processing ${s3Records.length} files(s)`)

  s3 = new AWS.S3()

  await s3Records.forEachAsync(async (record) => {
    const { s3: s3Record } = record
    const { bucket, object } = s3Record

    const { name: bucketName } = bucket
    const { key: objectKey } = object

    try {
      // Fetch the object from S3
      const s3Object = await s3.getObject({
        Bucket: bucketName,
        Key: objectKey
      }).promise()

      // Extract the body of the object
      const { Body: s3ObjectBody } = s3Object

      // Unzip the log file
      const s3ObjectUnzipped = await gunzip(s3ObjectBody)

      // Split the file into individual logs
      const fileLines = s3ObjectUnzipped.toString().split('\n')

      // Filter out empty lines
      fileLines.filter(Boolean).forEach((line) => {
        // Ignore comment lines from AWS
        // #Version: 1.0
        // #Fields: date time x - edge - location sc - bytes c - ip cs - method cs(Host) cs - uri - stem sc - status cs(Referer) cs(User - Agent) cs - uri - query cs(Cookie) x - edge - result - type x - edge - request - id x - host - header cs - protocol cs - bytes time - taken x - forwarded -for ssl - protocol ssl - cipher x - edge - response - result - type cs - protocol - version fle - status fle - encrypted - fields c - port time - to - first - byte x - edge - detailed - result - type sc - content - type sc - content - len sc - range - start sc - range - end
        if (line[0] !== '#') {
          console.log(line)
        }
      })
    } catch (e) {
      parseError(e)
    }
  })
}

export default cloudfrontToCloudwatch
