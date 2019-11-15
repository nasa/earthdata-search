/**
 * Logs necessary and safe data pertaining to a failed HTTP request
 * @param {Object} errorObj Exception object thrown
 */
export const logHttpError = (errorObj) => {
  const { error = {}, statusCode } = errorObj
  const { errors = [] } = error

  // Log each error provided
  errors.forEach((errorMessage) => {
    console.log(`HTTP Error (${statusCode}): ${errorMessage}`)
  })

  // Return the errors in case more needs to be or can be done with them
  return errors
}
