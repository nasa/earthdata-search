/**
 * @name doesObjectExist
 * @param {Object} s3 - instance of AWS.S3 from 'aws-sdk'
 * @param {String} bucketName - name of the S3 bucket
 * @param {String} key - object key
 * @description check if an object exists
 * see https://stackoverflow.com/questions/26726862/how-to-determine-if-object-exists-aws-s3-node-js-sdk
 */
export default async function doesObjectExist(s3, bucketName, key) {
  if (!bucketName) throw Error('missing bucketName')
  if (!key) throw Error('missing key')

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
