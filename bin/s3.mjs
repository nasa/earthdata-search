/**
 * This file runs s3rver to mock AWS S3. We use this so that we can run the `generateNotebook`
 * lambda function locally.
 *
 * If more buckets are needed in the future, add more values to the `configureBuckets` array.
 */

import S3rver from 's3rver'

const server = new S3rver({
  port: 4569,
  hostname: 'localhost',
  silent: false,
  directory: './tmp',
  configureBuckets: [{
    name: process.env.GENERATE_NOTEBOOKS_BUCKET_NAME
  }]
})

server.run()
