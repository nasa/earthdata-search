/**
 * @name clearBucket
 * @param {Object} s3 - instance of AWS.S3 from 'aws-sdk'
 * @param {String} bucketName
 * @description delete all objects in an S3 Bucket 
 */
export default async function clearBucket(s3, bucketName) {
  try {
    const { Contents = [] } = await s3.listObjects({ Bucket: bucketName }).promise();

    if (Contents.length > 0) {
      await s3.deleteObjects({
        Bucket: bucketName,
        Delete: {
          Objects: Contents.map(({ Key }) => ({ Key }))
        }
      }).promise()
    }
  } catch (error) {
    throw Error(`failed to clear bucket "${bucketName}"`, { cause: error })
  }
}