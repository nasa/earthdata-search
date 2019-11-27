import request from 'request-promise'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

const regionSearch = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { endpoint, exact, query } = event.queryStringParameters

  const { regionHost } = getEarthdataConfig(cmrEnv())

  const regionResponse = await request.get({
    uri: `${regionHost}/${endpoint}/${query}`,
    qs: {
      exact
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body } = regionResponse
  const {
    error,
    hits,
    time,
    results
  } = body

  if (error) {
    const [, errorCode, errorMessage] = error.match(/(\d{3}): (.+)/)

    return {
      isBase64Encoded: false,
      statusCode: parseInt(errorCode, 10),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        errors: [errorMessage]
      })
    }
  }

  console.log(`Request to ${endpoint} (exact: ${exact}) took ${time}`)

  const filteredResponse = []

  Object.keys(results).forEach((id) => {
    const { [id]: responseObject } = results
    filteredResponse.push({
      id,
      ...responseObject
    })
  })

  // Convert the string provided to a float
  const [, responseTime] = time.match(/(\d+\.\d+) ms\./)

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      hits,
      time: parseFloat(responseTime),
      results: filteredResponse
    })
  }
}

export default regionSearch
