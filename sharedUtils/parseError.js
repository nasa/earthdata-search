import { parse as parseXml } from 'fast-xml-parser'

/**
 * Parse and return a lambda friendly response to errors
 * @param {Object} errorObj The error object that was thrown
 * @param {Boolean} shouldLog Whether or not to log the exceptions found
 */
export const parseError = (errorObj, {
  shouldLog = true,
  asJSON = true,
  reThrowError = false
} = {}) => {
  const {
    name = 'Error',
    response = {}
  } = errorObj

  let errorArray = []
  let code = 500

  if (Object.keys(response).length) {
    const {
      body = {},
      data = {},
      headers = {},
      status,
      statusCode
    } = response

    // The request-promise library uses `body` for the response body
    let responseBody = body
    if (statusCode) code = statusCode

    // If that key is not set, fall back to what Axios uses, which is `data`
    if (Object.keys(body).length === 0) {
      responseBody = data
      if (status) code = status
    }

    const {
      description
    } = responseBody

    const { 'content-type': contentType = '' } = headers

    if (contentType.indexOf('application/opensearchdescription+xml') > -1) {
      // CWIC collections return errors in XML, ensure we capture them
      const osddBody = parseXml(responseBody, {
        ignoreAttributes: false,
        attributeNamePrefix: ''
      })
      const { OpenSearchDescription: description } = osddBody
      const { Description: errorMessage } = description

      errorArray = [errorMessage]
    } else if (contentType.indexOf('text/xml') > -1) {
      // CWIC collections return errors in XML, ensure we capture them
      const gibsError = parseXml(responseBody, {
        ignoreAttributes: false,
        attributeNamePrefix: ''
      })

      const { ExceptionReport: report } = gibsError
      const { Exception: exception } = report
      const { ExceptionText: errorMessage } = exception

      errorArray = [errorMessage]
    } else if (description) {
      // Harmony uses code/description object in the response
      errorArray = [description]
    } else {
      // Default to CMR error response body
      ({ errors: errorArray = ['Unknown Error'] } = responseBody)
    }

    if (shouldLog) {
      // Log each error provided
      errorArray.forEach((message) => {
        console.log(`${name} (${code}): ${message}`)
      })
    }
  } else {
    if (shouldLog) {
      console.log(errorObj.toString())
    }

    errorArray = [errorObj.toString()]
  }

  // If the error needs to be thrown again, do so before returning
  if (reThrowError) {
    throw errorObj
  }

  if (asJSON) {
    return {
      statusCode: code,
      body: JSON.stringify({
        statusCode: code,
        errors: errorArray
      })
    }
  }

  return errorArray
}
