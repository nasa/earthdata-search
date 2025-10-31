/**
 * Returns the custom authorizer context
 * @param {Object} event Details about the HTTP request that it received
 */
export const getAuthorizerContext = (event) => {
  const { requestContext = {} } = event
  const { authorizer = {} } = requestContext

  return authorizer
}
