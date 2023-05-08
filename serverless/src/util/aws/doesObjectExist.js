/**
 * Check if an object exists.
 * See https://stackoverflow.com/questions/26726862/how-to-determine-if-object-exists-aws-s3-node-js-sdk
 * @param {Object} s3 - instance of AWS.S3 from 'aws-sdk'
 * @param {String} bucketName - name of the S3 bucket
 * @param {String} key - object key
 */
export default async function doesObjectExist(s3, bucketName, key) {
  if (!bucketName) throw Error('Missing bucketName')
  if (!key) throw Error('Missing key')

  const params = {
    Bucket: bucketName,
    Key: key
  }
  return s3.headObject(params).promise().then(
    () => true,
    (err) => {
      if (err.code === 'NotFound') return false
      throw err
    }
  )
}
