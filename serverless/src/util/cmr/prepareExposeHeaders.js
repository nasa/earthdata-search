/**
 * Returns a list of headers to expose to the client response
 * @param {Object} headers The headers that were capable of exposing
 * @return {Array} The headers to expose, separated by a comma
 */
export const prepareExposeHeaders = (headers) => {
  // Add 'jwt-token' to access-control-expose-headers, so the client app can read the JWT
  const { 'access-control-expose-headers': exposeHeaders = '' } = headers
  const exposeHeadersList = exposeHeaders.split(',').filter(Boolean)
  exposeHeadersList.push('jwt-token')
  return exposeHeadersList.join(', ')
}
