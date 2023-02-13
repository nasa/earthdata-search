/**
 * @name deleteBucket
 * @param {Object} s3 - instance of AWS.S3 from 'aws-sdk'
 * @param {String} bucketName
 * @description in order to delete a bucket from S3, you first have to 
 * delete all the items in the bucket
 */
export default async function deleteBucket(s3, bucketName) {
    const { Contents = [] } = await s3.listObjects({ Bucket: bucketName }).promise();

    await s3.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key }))
      }
    }).promise()
  
    await s3.deleteBucket({ Bucket: bucketName }).promise()
}