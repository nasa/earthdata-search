import { S3Client } from '@aws-sdk/client-s3'

/**
 * Returns an S3 Client instance
 */
export const getS3Client = () => {
  const config = {}

  if (process.env.NODE_ENV === 'development') {
    config.endpoint = 'http://localhost:4569'
    config.forcePathStyle = true
    config.credentials = {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER'
    }
  }

  return new S3Client(config)
}
