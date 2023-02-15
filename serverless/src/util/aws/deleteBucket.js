import clearBucket from './clearBucket'

/**
 * @name deleteBucket
 * @param {Object} s3 - instance of AWS.S3 from 'aws-sdk'
 * @param {String} bucketName
 * @description in order to delete a bucket from S3, you first have to 
 * delete all the items in the bucket
 */
export default async function deleteBucket(s3, bucketName) {
    await clearBucket(s3, bucketName)

    await s3.deleteBucket({ Bucket: bucketName }).promise()
}
