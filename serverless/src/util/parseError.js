/**
 * Parse and return a lambda friendly response to errors
 * @param {Object} errorObj The error object that was thrown
 * @param {Boolean} shouldLog Whether or not to log the exceptions found
 */
export const parseError = (errorObj, shouldLog = true) => {
  const { error, name = 'Error', statusCode = 500 } = errorObj

  if (error) {
    const { errors = [] } = error

    if (shouldLog) {
      // Log each error provided
      errors.forEach((message) => {
        console.log(`${name} (${statusCode}): ${message}`)
      })
    }

    return {
      statusCode,
      body: JSON.stringify({ errors })
    }
  }

  if (shouldLog) {
    console.log(errorObj.toString())
  }

  return {
    statusCode,
    body: JSON.stringify({
      errors: [errorObj.toString()]
    })
  }
}
