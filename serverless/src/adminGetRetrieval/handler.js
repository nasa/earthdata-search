import { groupBy } from 'lodash'
import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'

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
    const { id: providedRetrieval } = event.pathParameters

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const retrievalResponse = await dbConnection('retrievals')
      .select('jsondata',
        'retrievals.id',
        'users.id',
        'users.urs_id',
        'retrieval_collections.id as cid',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_collections.granule_count',
        'retrieval_orders.id as oid',
        'retrieval_orders.state',
        'retrieval_orders.order_number',
        'retrieval_orders.order_information',
        'users.urs_id')
      .join('retrieval_collections', { 'retrievals.id': 'retrieval_collections.retrieval_id' })
      .join('retrieval_orders', { 'retrieval_collections.id': 'retrieval_orders.retrieval_collection_id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrievals.id': providedRetrieval
      })

    // Pull out the retrieval data from the first row (they will all be the same due to the join)
    const [retrievalObject] = retrievalResponse

    const groupedRetrievals = groupBy(retrievalResponse, row => row.cid)

    console.log(groupedRetrievals)

    const formattedResponse = {
      id: retrievalObject.id,
      collections: groupedRetrievals
    }

    // const retrievalsResponse = groupBy(retrievalResponse.map(retrieval => ({
    //   ...retrieval,
    //   id: retrieval.id,
    //   obfuscated_id: obfuscateId(retrieval.id)
    // })), row => row.cid)

    // Object.values(groupedRetrievals).forEach((retrievalRecord) => {
    //   const [firstRow] = retrievalRecord

    //   const {
    //     id,
    //     obfuscated_id: obfuscatedId,
    //     created_at: createdAt,
    //     jsondata,
    //     environment,
    //     user_id: userId,
    //     urs_id: username
    //   } = firstRow

    //   retrievalsResponse.push({
    //     id,
    //     obfuscated_id: obfuscatedId,
    //     created_at: createdAt,
    //     user_id: userId,
    //     username,
    //     jsondata,
    //     environment,
    //     collections: retrievalRecord.map(record => ({
    //       collection_id: record.collection_id,
    //       granule_count: record.granule_count,
    //       id: record.retrieval_collection_id,
    //       obfuscated_id: obfuscateId(record.obfuscated_id)
    //     }))
    //   })
    // })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(formattedResponse)
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
