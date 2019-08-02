/**
 * Returns the JWT Token from our custom authorizer context
 * @param {Object} event Lambda function event parameter
 */
export const getJwtToken = (event) => {
  const { requestContext } = event
  const { authorizer } = requestContext
  const { jwtToken } = authorizer
  return jwtToken
}
