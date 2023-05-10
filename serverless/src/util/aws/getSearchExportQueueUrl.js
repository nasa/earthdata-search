/**
 * Returns the search export SQS queue url from the env variable
 * @returns {string} The order processing queue URL
 */
export default function getSearchExportQueueUrl() {
  let queueUrl = process.env.searchExportQueueUrl

  if (process.env.IS_OFFLINE) {
    // If running locally, set a default queue
    queueUrl = 'http://0.0.0.0:9324/queue/earthdata-search-dev-SearchExportQueue'
  }

  return queueUrl
}
