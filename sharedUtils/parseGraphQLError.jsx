/**
 * Parse a GraphQL response inspecting for and thrown an error if one is found
 * @param {Object} response GraphQL response object
 */
export const parseGraphQLError = (response) => {
  const { data = {} } = response
  const { errors = [] } = data

  const [firstErrorMessage] = errors

  // If the response contains an error
  if (errors.length > 0) {
    const { message } = firstErrorMessage

    // Throw an error to compensate for the 200 HTTP code that GraphQL returns
    throw new Error(message)
  }
}
