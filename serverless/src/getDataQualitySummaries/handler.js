import AWS from 'aws-sdk'

import 'array-foreach-async'
import request from 'request-promise'
import { getClientId, getEarthdataConfig } from '../../../sharedUtils/config'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getJwtToken } from '../util/getJwtToken'
import { getEdlConfig } from '../util/configUtil'

// AWS SQS adapter
let sqs

const getDataQualitySummaries = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)

  if (!sqs) {
    sqs = new AWS.SQS({ apiVersion: '2012-11-05' })
  }

  const jwtToken = getJwtToken(event)
  const { token } = getVerifiedJwtToken(jwtToken)
  const { access_token: accessToken } = token

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  const { echoRestRoot } = getEarthdataConfig(cmrEnv())

  const { catalog_item_id: catalogItemId } = params

  try {
    const dataQualitySummaries = []
    const errors = []

    const dqsAssociationResponse = await request.get({
      uri: `${echoRestRoot}/data_quality_summary_definitions.json`,
      qs: {
        catalog_item_id: catalogItemId
      },
      headers: {
        'Echo-Token': `${accessToken}:${clientId}`,
        'Client-Id': getClientId().background
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body } = dqsAssociationResponse

    // If there aren't any data quality summaries return a successful response with an empty body
    if (body.length === 0) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify([])
      }
    }

    await body.forEachAsync(async (dqsAssociation) => {
      const { reference = {} } = dqsAssociation
      const { id: dqsId } = reference

      try {
        const dqsResponse = await request.get({
          uri: `${echoRestRoot}/data_quality_summary_definitions/${dqsId}.json`,
          headers: {
            'Echo-Token': `${accessToken}:${clientId}`,
            'Client-Id': getClientId().background
          },
          json: true,
          resolveWithFullResponse: true
        })

        const { body = {} } = dqsResponse
        const { data_quality_summary_definition: dataQualitySummary = {} } = body

        dataQualitySummaries.push(dataQualitySummary)
      } catch (e) {
        const { error } = e
        const { errors: echoRestErrors } = error
        const [errorMessage] = echoRestErrors

        errors.push(errorMessage)

        console.log(`Data Quality Summary retrieval error for ${catalogItemId}: ${errorMessage}`)
      }
    })

    console.log(`Data Quality Summaries found for ${catalogItemId}: ${JSON.stringify(dataQualitySummaries, null, 4)}`)

    if (dataQualitySummaries.length > 0) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(dataQualitySummaries)
      }
    }

    // If we've reached this point we expected to find data quality
    // summaries but didn't so we'll return a 404
    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ errors })
    }
  } catch (e) {
    console.log(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default getDataQualitySummaries
