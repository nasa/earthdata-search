import { parse as parseXml } from 'fast-xml-parser'

/**
 * Parse and return a lambda friendly response to errors
 * @param {Object} errorObj The error object that was thrown
 * @param {Boolean} shouldLog Whether or not to log the exceptions found
 */
export const parseError = (errorObj, {
  shouldLog = true,
  asJSON = true,
  reThrowError = false,
  logPrefix
} = {}) => {
  const {
    name = 'Error',
    response = {}
  } = errorObj

  let errorArray = []
  let code = 500

  if (Object.keys(response).length) {
    const {
      data = {},
      headers = {},
      status,
      statusText
    } = response

    code = status

    const {
      description: harmonyError,
      error: hucError,
      message: hucSocketError
    } = data

    const { 'content-type': contentType = '' } = headers

    if (contentType.indexOf('application/opensearchdescription+xml') > -1) {
      // CWIC collections return errors in XML, ensure we capture them
      const osddBody = parseXml(data, {
        ignoreAttributes: false,
        attributeNamePrefix: ''
      })
      const { OpenSearchDescription: description } = osddBody
      const { Description: errorMessage } = description

      errorArray = [errorMessage]
    } else if (contentType.indexOf('text/xml') > -1) {
      // CWIC collections return errors in XML, ensure we capture them
      const gibsError = parseXml(data, {
        ignoreAttributes: false,
        attributeNamePrefix: ''
      })

      const { ExceptionReport: report } = gibsError
      const { Exception: exception } = report
      const { ExceptionText: errorMessage } = exception

      errorArray = [errorMessage]
    } else if (harmonyError) {
      // Harmony uses code/description object in the response
      errorArray = [harmonyError]
    } else if (hucError || hucSocketError) {
      // HUC uses code/description object in the response
      errorArray = [hucError || hucSocketError]
    } else if (contentType.indexOf('text/html') > -1) {
      // If the error is from Axios and the content type is html, build a string error using the status code and status text
      errorArray = [`${name} (${code}): ${statusText}`]
    } else {
      // Default to CMR error response body
      ({ errors: errorArray = ['Unknown Error'] } = data)
    }

    if (shouldLog) {
      // Log each error provided
      errorArray.forEach((message) => {
        console.log(`${name} (${code}): ${message}`)
      })
    }
  } else {
    const logParts = [
      logPrefix,
      errorObj.toString()
    ]

    if (shouldLog) {

      console.log(logParts.filter(Boolean).join(' '))
    }

    errorArray = [logParts.filter(Boolean).join(' ')]
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
