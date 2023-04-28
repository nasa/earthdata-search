const AWS = require('aws-sdk')

/**
 * This serverless plugin sets up our local AWS S3 simulation
 * Basically, it creates the default buckets used by EDSC.
 */
class ServerlessOfflineConfigS3 {
  constructor(serverless) {
    const config = serverless.configurationInput.custom['serverless-offline-config-s3']
    const { buckets, endpoint, region = 'us-east-1' } = config

    if (!buckets) throw Error('serverless-offline-config-s3 missing buckets')
    if (!endpoint) throw Error('serverless-offline-config-s3 missing endpoint')
    if (!region) throw Error('serverless-offline-config-s3 missing region')

    this.buckets = buckets
    this.endpoint = endpoint
    this.region = region

    this.hooks = {
      'offline:start:init': this.start.bind(this)
    }
  }

  async start() {
    try {
      AWS.config.update({
        accessKeyId: 'MOCK_ACCESS_KEY_ID',
        secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
        region: this.region
      })

      const s3 = new AWS.S3({
        endpoint: this.endpoint,
        s3ForcePathStyle: true
      })

      const { Buckets = [] } = await s3.listBuckets().promise()

      const bucketNames = Buckets.map(({ Name }) => Name)

      for (let i = 0; i < this.buckets.length; i += 1) {
        const bucketName = this.buckets[i]

        if (!bucketNames.includes(bucketName)) {
          const createBucketOptions = {
            Bucket: bucketName
          }

          // us-east-1 is actually an invalid LocationRestraint because it is the default region
          // see: https://stackoverflow.com/questions/51912072/invalidlocationconstraint-error-while-creating-s3-bucket-when-the-used-command-i
          createBucketOptions.CreateBucketConfiguration = {
            // we have to pass in a blank LocationConstraint if region is us-east-1,
            // because if no LocationConstraint is defined, aws-sdk will pick up whatever region is configured locally
            LocationConstraint: typeof this.region === 'string' && this.region !== 'us-east-1' ? this.region : ''
          }
          try {
            // eslint-disable-next-line no-await-in-loop
            await s3.createBucket(createBucketOptions).promise()
            console.log('created bucket:', bucketName)
          } catch (error) {
            console.error('failed to create bucket:', bucketName)
            console.error(error)
            throw error
          }
        }
      }
    } catch (error) {
      if (error.code === 'UnknownEndpoint') {
        console.error('please run: npm run s3')
      } else {
        throw error
      }
    }
  }
}

module.exports = ServerlessOfflineConfigS3
