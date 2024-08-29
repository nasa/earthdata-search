/**
 * Returns the JWT Token from our custom authorizer context
 * @param {Object} event Details about the HTTP request that it received
 */
export const getJwtToken = (event) => {
  const { requestContext = {} } = event
  const { authorizer = {} } = requestContext
  const { jwtToken } = authorizer
  console.log('🚀 ~ file: getJwtToken.js:9 ~ getJwtToken ~ jwtToken:', jwtToken)

  return jwtToken
}
