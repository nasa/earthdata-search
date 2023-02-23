const AWS = require('aws-sdk')

/**
 * This serverless plugin sets up our local AWS S3 simulation
 * Basically, it creates the default buckets used by EDSC.
 */
class ServerlessOfflineConfigS3 {
  constructor(serverless) {
    const config = serverless.configurationInput.custom['serverless-offline-config-s3']
    const { buckets, endpoint, region } = config

    if (!buckets) throw Error('serverless-offline-config-s3 missing buckets')
    if (!endpoint) throw Error('serverless-offline-config-s3 missing endpoint')
    if (!region) throw Error('serverless-offline-config-s3 missing region')

    this.buckets = buckets
    this.endpoint = endpoint
    this.region = region

    this.hooks = {
      'offline:start:init': this.start.bind(this),
    };
  }

  async start() {
    AWS.config.update({
      accessKeyId: Math.random().toString(),
      secretAccessKey: Math.random().toString(),
      region: this.region
    })

    const s3 = new AWS.S3({
      endpoint: this.endpoint,
      s3ForcePathStyle: true
    })

    const { Buckets = [] } = await s3.listBuckets().promise()

    const bucketNames = Buckets.map(({ Name }) => Name)

    for (let i = 0; i < this.buckets.length; i++) {
      const bucketName = this.buckets[i]

      if (!bucketNames.includes(bucketName)) {
        await s3.createBucket({
          Bucket: bucketName,
          CreateBucketConfiguration: {
            LocationConstraint: this.region
          }
        }).promise()
      }
    }
  }
}

module.exports = ServerlessOfflineConfigS3
