/**
 * Determine whether or not the event provided is
 * @param {Object} event Lambda function event parameter
 */
export const isWarmUp = async (event) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('[WarmUp] Lambda is warm!')

    // Introduce a slight timeout to ensure all requested
    // lambdas are started when concurrency is used
    await new Promise(r => setTimeout(r, 15))

    return true
  }

  return false
}
