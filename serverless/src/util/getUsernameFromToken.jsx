/**
 * Strips the username out of the URS token endpoint
 * @param {Object} token URS token object
 */
export const getUsernameFromToken = (token) => {
  const { endpoint } = token
  const username = endpoint.split('/').pop()

  return username
}
