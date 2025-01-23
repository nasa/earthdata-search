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
