import { groupBy, sortBy } from 'lodash'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Retrieve all the retrievals for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
export default async function getRetrievals(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { headers } = event

    const earthdataEnvironment = determineEarthdataEnvironment(headers)

    const jwtToken = getJwtToken(event)

    const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('jsondata',
        'retrievals.id',
        'retrievals.environment',
        'retrievals.created_at',
        'retrieval_collections.collection_metadata',
        'users.urs_id')
      .join('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'users.id': userId
      })

    const groupedRetrievals = groupBy(retrievalResponse.map((retrieval) => ({
      ...retrieval,
      id: obfuscateId(retrieval.id)
    })), (row) => row.id)

    const retrievalsResponse = []
    Object.values(groupedRetrievals).forEach((retrievalRecord) => {
      const [firstRow] = retrievalRecord

      const {
        id,
        created_at: createdAt,
        jsondata,
        environment
      } = firstRow

      retrievalsResponse.push({
        id,
        created_at: createdAt,
        jsondata,
        environment,
        collections: retrievalRecord.map((record) => record.collection_metadata)
      })
    })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(Object.values(sortBy(retrievalsResponse, 'created_at')).reverse())
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}
