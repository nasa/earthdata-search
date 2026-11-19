/**
 * This file runs s3rver to mock AWS S3. We use this so that we can run the `generateNotebook`
 * lambda function locally.
 *
 * If more buckets are needed in the future, add more values to the `configureBuckets` array.
 */

import S3rver from 's3rver'

const corsXml = `
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
  </CORSRule>
</CORSConfiguration>
`

const server = new S3rver({
  port: 4569,
  hostname: 'localhost',
  silent: false,
  directory: './tmp',
  configureBuckets: [{
    name: process.env.NLP_SHORT_NAME_FILE_BUCKET_NAME
  }, {
    name: process.env.SHAPEFILE_UPLOAD_BUCKET_NAME,
    configs: [corsXml]
  }]
})

server.run()
