import request from 'request-promise'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { requestTimeout } from '../util/requestTimeout'

const regionSearch = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { endpoint, exact, query } = event.queryStringParameters

  const { regionHost } = getEarthdataConfig(cmrEnv())

  let regionResponse
  try {
    regionResponse = await request.get({
      uri: `${regionHost}/${endpoint}/${query}`,
      qs: {
        exact
      },
      json: true,
      resolveWithFullResponse: true,
      timeout: requestTimeout(),
      time: true
    })
  } catch (e) {
    const {
      error = {},
      message,
      response,
      statusCode: errorStatusCode
    } = e

    // Default error messaging
    let statusCode = 500
    let errorMessage = 'An unknown error has occurred'

    if (!regionResponse) {
      if (errorStatusCode) {
        const { message } = error

        if (message) errorMessage = message

        statusCode = errorStatusCode

        const { elapsedTime } = response

        console.log(`Request for '${endpoint}' (exact: ${exact}) failed in ${elapsedTime} ms`)
      } else if (message.includes('ESOCKETTIMEDOUT') || message.includes('ETIMEDOUT')) {
        // If no valid error response was provided construct an error from the exception object
        statusCode = 504
        errorMessage = `Request to external service timed out after ${requestTimeout()} ms`

        console.log(`Request for '${endpoint}' (exact: ${exact}) failed in ${requestTimeout()} ms`)
      } else {
        errorMessage = message
      }
    } else {
      const { statusCode: responseStatusCode, error: responseError = {} } = regionResponse
      const { message: responseErrorMessage } = responseError

      statusCode = responseStatusCode
      errorMessage = responseErrorMessage
    }

    return {
      isBase64Encoded: false,
      statusCode,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        errors: [errorMessage]
      })
    }
  }

  const { body, elapsedTime } = regionResponse
  const {
    error,
    errorMessage,
    hits,
    time,
    results
  } = body

  // Handles a 200 with body.error (which includes the actual statusCode)
  if (error) {
    console.log(`Request for '${endpoint}' (exact: ${exact}) failed in ${elapsedTime} ms`)

    const [, errorCode, parsedErrorMessage] = error.match(/(\d{3}): (.+)/)

    return {
      isBase64Encoded: false,
      statusCode: parseInt(errorCode, 10),
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        errors: [parsedErrorMessage]
      })
    }
  }

  // Handles a 200 with body.errorMessage
  if (errorMessage) {
    console.log(`Request for '${endpoint}' (exact: ${exact}) failed in ${elapsedTime} ms`)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        errors: [errorMessage]
      })
    }
  }

  console.log(`Request for '${endpoint}' (exact: ${exact}) successfully completed in [reported: ${time}, observed: ${elapsedTime} ms]`)

  const filteredResponse = []

  Object.keys(results).forEach((id) => {
    const { [id]: responseObject } = results

    let formattedResponseObject = {
      ...responseObject
    }

    if (endpoint === 'region') {
      formattedResponseObject = {
        id: formattedResponseObject.HUC,
        name: id,
        spatial: formattedResponseObject['Visvalingam Polygon'],
        type: 'huc'
      }
    }

    if (endpoint === 'huc') {
      formattedResponseObject = {
        id,
        name: formattedResponseObject['Region Name'],
        spatial: formattedResponseObject['Visvalingam Polygon'],
        type: 'huc'
      }
    }

    // TODO: Handle reformatting SWOT features
    filteredResponse.push({
      id,
      ...formattedResponseObject
    })
  })

  // Convert the string provided to a float
  const [, responseTime] = time.match(/(\d+\.\d+) ms\./)

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify({
      hits,
      time: parseFloat(responseTime),
      results: filteredResponse
    })
  }
}

export default regionSearch
