import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getAuthorizerContext } from '../util/getAuthorizerContext'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Delete a retrieval from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
export default async function deleteRetrieval(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const { pathParameters } = event

    const { id: providedRetrieval } = pathParameters

    // Decode the provided retrieval id
    const decodedRetrievalId = deobfuscateId(providedRetrieval)

    const { userId } = getAuthorizerContext(event)

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // Nullify the foreign key constraint on the table before deleting
    await dbConnection('retrieval_collections')
      .where('retrieval_id', decodedRetrievalId)
      .update('retrieval_id', null)

    // Retrieve the authenticated users' id to ensure the retrieval being deleted belongs to them
    const affectedRows = await dbConnection('retrievals')
      .where({
        user_id: userId,
        id: decodedRetrievalId
      })
      .del()

    if (affectedRows > 0) {
      return {
        isBase64Encoded: false,
        statusCode: 204,
        headers: {
          ...defaultResponseHeaders,
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
        },
        body: null
      }
    }

    // If no rows were affected the where clause returned no rows, return a 404
    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: {
        ...defaultResponseHeaders,
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({ errors: [`Retrieval '${providedRetrieval}' not found.`] })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: {
        ...defaultResponseHeaders,
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      ...parseError(error)
    }
  }
}
