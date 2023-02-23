/**
 * Returns the search export bucket name from the env variable or the hard-coded offline value
 * @return {string} the bucket name
 */
export const getSearchExportBucket = () => {
  let bucket = process.env.searchExportBucket

  if (process.env.IS_OFFLINE) {
    // If we are running locally offline, this is the queueUrl
    bucket = 'mock-search-export-bucket'
  }

  console.log('got search export bucket name: ' + bucket)
  return bucket
}
