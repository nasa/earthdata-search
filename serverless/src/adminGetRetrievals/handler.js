import { groupBy, sortBy } from 'lodash'
import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { obfuscateId } from '../util/obfuscation/obfuscateId'

/**
 * Retrieve all the retrievals for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
export default async function adminGetRetrievals(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  try {
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('jsondata',
        'retrievals.id',
        'retrievals.environment',
        'retrievals.created_at',
        'retrieval_collections.id as retrieval_collection_id',
        'retrieval_collections.collection_id',
        'retrieval_collections.collection_metadata',
        'retrieval_collections.granule_count',
        'users.id as user_id',
        'users.urs_id')
      .join('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })

    const groupedRetrievals = groupBy(retrievalResponse.map(retrieval => ({
      ...retrieval,
      id: retrieval.id,
      obfuscated_id: obfuscateId(retrieval.id)
    })), row => row.id)

    const retrievalsResponse = []
    Object.values(groupedRetrievals).forEach((retrievalRecord) => {
      const [firstRow] = retrievalRecord

      const {
        id,
        obfuscated_id: obfuscatedId,
        created_at: createdAt,
        jsondata,
        environment,
        user_id: userId,
        urs_id: username
      } = firstRow

      retrievalsResponse.push({
        id,
        obfuscated_id: obfuscatedId,
        created_at: createdAt,
        user_id: userId,
        username,
        jsondata,
        environment,
        collections: retrievalRecord.map(record => ({
          collection_id: record.collection_id,
          collection_title: record.collection_metadata.title,
          granule_count: record.granule_count,
          id: record.retrieval_collection_id,
          obfuscated_id: obfuscateId(record.obfuscated_id)
        }))
      })
    })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(Object.values(sortBy(retrievalsResponse, 'created_at')).reverse())
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
