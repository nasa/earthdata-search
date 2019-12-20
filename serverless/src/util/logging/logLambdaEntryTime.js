/**
 * Logs information pertaining to the amount of time it took for a request to get to a lambda
 * @param {String} requestId The request id guid generated for the request for this lambda
 * @param {Integer} invocationTime The time that the request was invoked at
 * @param {Object} context The lambda context object
 */
export const logLambdaEntryTime = (requestId, invocationTime, context) => {
  const { functionName = 'Unknown Function' } = context

  console.log(`Request ${requestId} entered lambda (${functionName}) after ${Date.now() - invocationTime} ms`)
}
