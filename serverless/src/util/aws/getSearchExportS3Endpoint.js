/**
 * Returns the search export S3 endpoint from the env variable or the hard coded offline value
 * @return {string} url to the S3 endpoint
 */
export default function getSearchExportS3Endpoint() {
  let endpoint = process.env.searchExportS3Endpoint

  if (process.env.IS_OFFLINE) {
    // If running locally, this is the local S3-compatible endpoint
    endpoint = 'http://0.0.0.0:5000'
  }

  return endpoint
}
