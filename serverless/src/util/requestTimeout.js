/**
 * Determine the length of the time to allow an http request to perform
 * @param {Integer} workloadThreshold The time to allow the lambda to do its processing beyond the request time
 */
export const requestTimeout = ({
  definedTimeout = process.env.LAMBDA_TIMEOUT,
  workloadThreshold = 10
} = {}) => {
  const lambdaTimeout = parseInt(definedTimeout, 10)

  // Return the difference between our lambda timeout and the
  // time required to perform the lambda work
  return (lambdaTimeout - workloadThreshold) * 1000
}
