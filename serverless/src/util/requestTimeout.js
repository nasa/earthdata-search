/**
 * Determine the length of the time to allow an http request to perform
 * @param {Integer} workloadThreshold The time to allow the lambda to do its processing beyond the request time
 */
export const requestTimeout = (workloadThreshold = 10) => {
  const lambdaTimeout = parseInt(process.env.LAMBDA_TIMEOUT, 10)

  // Return the difference between our lambda timeout and the
  // time required to perform the lambda work
  return (lambdaTimeout - workloadThreshold) * 1000
}
