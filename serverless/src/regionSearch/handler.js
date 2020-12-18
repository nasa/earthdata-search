import axios from 'axios'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { requestTimeout } from '../util/requestTimeout'
import { parseError } from '../../../sharedUtils/parseError'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

const regionSearch = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { headers, queryStringParameters } = event

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const { endpoint, exact, query } = queryStringParameters

  const { regionHost } = getEarthdataConfig(earthdataEnvironment)

  let regionResponse
  try {
    regionResponse = await wrappedAxios({
      method: 'get',
      url: `${regionHost}/${endpoint}/${query}`,
      params: {
        exact
      },
      timeout: requestTimeout()
    })

    // Errors are returned with a 200 status code
    const { data } = regionResponse
    const { error } = data

    // If an error is present in a successful response
    if (error) {
      // Construct an error resembling that of an HTTP error
      const errorObj = new Error(error)

      // Mimic Axios' http error response by adding a key for response and providing the response object
      errorObj.response = regionResponse

      // Throw the error to be caught in the catch block below
      throw errorObj
    }
  } catch (e) {
    const { response = {} } = e

    let { status: statusCode } = response

    let errorMessage

    // Use our parseError method to extract the error message out
    const parsedError = parseError(e, { asJSON: false, shouldLog: false })
    const [parsedErrorMessage] = parsedError

    // Search the error message looking for the FTS standard (CODE: Message)
    const errorRegexMatch = parsedErrorMessage.match(/(\d{3})?:?\s?(.*)/)

    if (errorRegexMatch) {
      // Regex response will contain [
      //  Original,
      //  Status Code or undefined,
      //  Error Message,
      //  Some Object we don't care about
      // ]
      ([, statusCode = 500, errorMessage] = errorRegexMatch)
    }

    // An actual timeout does not return a status code, we shouldn't see this happen
    // given that we set a timeout on the request to FTS that defines a padding
    if (errorMessage.includes('ESOCKETTIMEDOUT') || errorMessage.includes('ETIMEDOUT')) {
      // If no valid error response was provided construct an error from the exception object
      statusCode = 504
      errorMessage = `Request to external service timed out after ${requestTimeout()} ms`

      console.log(`Request for '${endpoint}' (exact: ${exact}) failed in ${requestTimeout()} ms`)
    } else {
      // Regex returns a string result from `match` and we need/want an integer
      statusCode = parseInt(statusCode, 10)
      errorMessage = errorMessage.trim()

      const { config = {} } = response
      const { elapsedTime } = config

      console.log(`Request for '${endpoint}' (exact: ${exact}) failed in ${elapsedTime} ms`)
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

  const { config, data } = regionResponse
  const { elapsedTime } = config

  const {
    hits,
    time,
    results
  } = data

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
