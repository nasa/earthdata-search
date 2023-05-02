/**
 * @param {Object} s3 - instance of AWS.S3 from 'aws-sdk'
 * @param {String} bucketName
 * @returns {Promise<Boolean>} exists - Promise that resolves to true or false
 */
export default async function doesBucketExist(s3, bucketName) {
  const { Buckets = [] } = await s3.listBuckets().promise()

  const bucketNames = Buckets.map(({ Name }) => Name)

  return bucketNames.includes(bucketName)
}
