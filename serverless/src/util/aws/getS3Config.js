import getSearchExportS3Endpoint from './getSearchExportS3Endpoint'

/**
 * Returns an environment specific configuration object for S3
 * @return {Object} A configuration object for S3
 */
export const getS3Config = () => {
  const s3config = {
    endpoint: getSearchExportS3Endpoint()
  }

  if (process.env.IS_OFFLINE || process.env.JEST_WORKER_ID) {
    s3config.s3ForcePathStyle = true
  }

  return s3config
}
