import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'
import { isWarmUp } from '../util/isWarmup'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'

// Knex database connection object
let dbConnection = null

/**
 * Handler to retrieve a single color map record from the application database
 */
export default async function deleteRetrieval(event) {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false
  try {
    const { id: providedRetrieval } = event.pathParameters

    // Decode the provided retrieval id
    const decodedRetrievalId = parseInt(deobfuscateId(providedRetrieval), 10)

    const jwtToken = getJwtToken(event)
    const { token } = getVerifiedJwtToken(jwtToken)
    const username = getUsernameFromToken(token)

    // Retrieve a connection to the database
    dbConnection = await getDbConnection(dbConnection)
    // Postgres doesn't support deleting with a join so in order to ensure
    // users can only delete their own records we'll get the ids of the records they own first
    const userRetrievals = await dbConnection('retrievals')
      .select('retrievals.id')
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'users.urs_id': username
      })
    // Ensure that the provided retrieval id belongs to the authenticated user
    if (userRetrievals.map(r => r.id).includes(decodedRetrievalId)) {
      await dbConnection('retrievals')
        .join('users', { 'retrievals.user_id': 'users.id' })
        .where({
          'retrievals.id': decodedRetrievalId
        })
        .del()

      return {
        isBase64Encoded: false,
        statusCode: 204,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: null
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [`Retrieval '${providedRetrieval}' not found.`] })
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
