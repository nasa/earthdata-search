import 'array-foreach-async'
import request from 'request-promise'
import uuidv4 from 'uuid/v4'

import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getJwtToken } from '../util/getJwtToken'
import { getEchoToken } from '../util/urs/getEchoToken'
import { parseError } from '../../../sharedUtils/parseError'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve data quality summaries for a given CMR Collection
 * @param {Object} event Details about the HTTP request that it received
 */
const getDataQualitySummaries = async (event) => {
  const { body } = event
  const { params, requestId } = JSON.parse(body)

  const jwtToken = getJwtToken(event)

  const echoToken = await getEchoToken(jwtToken)

  const { echoRestRoot } = getEarthdataConfig(cmrEnv())

  const { catalogItemId } = params

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const dataQualitySummaries = []
    const errors = []

    const dqsAssociationResponse = await request.get({
      uri: `${echoRestRoot}/data_quality_summary_definitions.json`,
      qs: {
        catalog_item_id: catalogItemId
      },
      headers: {
        'Echo-Token': echoToken,
        'Client-Id': getClientId().background,
        'CMR-Request-Id': requestId
      },
      json: true,
      time: true,
      resolveWithFullResponse: true
    })

    console.log(`Request ${requestId} completed external request after ${dqsAssociationResponse.elapsedTime} ms`)

    const { body } = dqsAssociationResponse

    // If there aren't any data quality summaries return a successful response with an empty body
    if (body.length === 0) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify([])
      }
    }

    await body.forEachAsync(async (dqsAssociation) => {
      const dataQualitySummaryRequestId = uuidv4()

      const { reference = {} } = dqsAssociation
      const { id: dqsId } = reference

      let dqsResponse
      try {
        dqsResponse = await request.get({
          uri: `${echoRestRoot}/data_quality_summary_definitions/${dqsId}.json`,
          headers: {
            'Echo-Token': echoToken,
            'Client-Id': getClientId().background,
            'CMR-Request-Id': dataQualitySummaryRequestId
          },
          json: true,
          time: true,
          resolveWithFullResponse: true
        })

        console.log(`Request ${dataQualitySummaryRequestId} for data quality summary ${catalogItemId} completed after ${dqsResponse.elapsedTime} ms`)

        const { body } = dqsResponse
        const { data_quality_summary_definition: dataQualitySummary = {} } = body

        dataQualitySummaries.push(dataQualitySummary)
      } catch (e) {
        const { error } = e
        const { errors: echoRestErrors } = error
        const [errorMessage] = echoRestErrors

        errors.push(errorMessage)

        console.log(`Request ${dataQualitySummaryRequestId} for data quality summary ${catalogItemId} failed after ${errorMessage}`)
      }
    })

    if (dataQualitySummaries.length > 0) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify(dataQualitySummaries)
      }
    }

    // If we've reached this point we expected to find data quality
    // summaries but didn't so we'll return a 404
    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getDataQualitySummaries
