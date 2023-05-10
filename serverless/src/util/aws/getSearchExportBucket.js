/**
 * Returns the search export bucket name from the env variable or the hard-coded offline value
 * @returns {string} the bucket name
 */
export const getSearchExportBucket = () => {
  let bucket = process.env.searchExportBucket

  if (process.env.IS_OFFLINE) {
    // If running locally, set a default bucket
    bucket = 'earthdata-search-dev-SearchExportBucket'
  }

  return bucket
}
