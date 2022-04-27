import 'array-foreach-async'

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

/**
 * Retrieve data quality summaries for a given CMR Collection
 * @param {Object} event Details about the HTTP request that it received
 */
const getDataQualitySummaries = async (event) => {
  const { body, headers } = event

  const { params, requestId } = JSON.parse(body)

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const jwtToken = getJwtToken(event)

  const echoToken = await getEchoToken(jwtToken, earthdataEnvironment)

  const { echoRestRoot } = getEarthdataConfig(earthdataEnvironment)

  const { catalogItemId } = params

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const dataQualitySummaries = []
    const errors = []

    const dqsAssociationResponse = await wrappedAxios({
      method: 'get',
      url: `${echoRestRoot}/data_quality_summary_definitions.json`,
      params: {
        catalog_item_id: catalogItemId
      },
      headers: {
        Authorization: `Bearer ${echoToken}`,
        'Client-Id': getClientId().background,
        'CMR-Request-Id': requestId
      }
    })

    const { config, data } = dqsAssociationResponse
    const { elapsedTime } = config

    console.log(`Request ${requestId} completed external request after ${elapsedTime} ms`)

    // If there aren't any data quality summaries return a successful response with an empty body
    if (data.length === 0) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify([])
      }
    }

    await data.forEachAsync(async (dqsAssociation) => {
      const dataQualitySummaryRequestId = uuidv4()

      const { reference = {} } = dqsAssociation
      const { id: dqsId } = reference

      let dqsResponse
      try {
        dqsResponse = await wrappedAxios({
          method: 'get',
          url: `${echoRestRoot}/data_quality_summary_definitions/${dqsId}.json`,
          headers: {
            Authorization: `Bearer ${echoToken}`,
            'Client-Id': getClientId().background,
            'CMR-Request-Id': dataQualitySummaryRequestId
          }
        })

        const { config: dqsConfig, data: dqsData } = dqsResponse
        const { elapsedTime: dqsElapsedTime } = dqsConfig

        console.log(`Request ${dataQualitySummaryRequestId} for data quality summary ${catalogItemId} completed after ${dqsElapsedTime} ms`)

        const { data_quality_summary_definition: dataQualitySummary = {} } = dqsData

        dataQualitySummaries.push(dataQualitySummary)
      } catch (e) {
        const echoRestErrors = parseError(e, { asJSON: false })

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
