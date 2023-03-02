import { XMLParser } from 'fast-xml-parser'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
})

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
      // OpenSearch collections can return errors in XML, ensure we capture them
      const osddBody = xmlParser.parse(data)

      const {
        feed = {},
        OpenSearchDescription: description = {}
      } = osddBody

      // Granule errors will come from within a `feed` element
      const {
        subtitle
      } = feed

      if (description) {
        const { Description: errorMessage } = description

        errorArray = [errorMessage]
      }

      if (subtitle) {
        if (typeof subtitle === 'object' && subtitle !== null) {
          const { '#text': text } = subtitle

          errorArray = [text]
        } else {
          errorArray = [subtitle]
        }
      }
    } else if (contentType.indexOf('text/xml') > -1) {
      // OpenSearch collections can return errors in XML, ensure we capture them
      const gibsError = xmlParser.parse(data)

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
        const logParts = [
          logPrefix,
          `${name} (${code}): ${message}`
        ]

        console.log(logParts.filter(Boolean).join(' '))
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
