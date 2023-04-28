import getSearchExportS3Endpoint from './getSearchExportS3Endpoint'

/**
 * Returns an environment specific configuration object for S3
 * @return {Object} A configuration object for S3
 */
export const getS3Config = () => ({
  endpoint: getSearchExportS3Endpoint()
})
