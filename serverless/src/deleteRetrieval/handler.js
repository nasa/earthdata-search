import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { isWarmUp } from '../util/isWarmup'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'

/**
 * Handler to retrieve a single color map record from the application database
 */
export default async function deleteRetrieval(event) {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false
  try {
    const { id: providedRetrieval } = event.pathParameters

    // Decode the provided retrieval id
    const decodedRetrievalId = deobfuscateId(providedRetrieval)

    const jwtToken = getJwtToken(event)
    const { id: userId } = getVerifiedJwtToken(jwtToken)

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

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
          'Access-Control-Allow-Origin': '*',
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({ errors: [`Retrieval '${providedRetrieval}' not found.`] })
    }
  } catch (e) {
    console.log(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({ errors: [e] })
    }
  }
}
