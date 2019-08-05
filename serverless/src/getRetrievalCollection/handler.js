import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'
import { isWarmUp } from '../util/isWarmup'

// Knex database connection object
let dbConnection = null

/**
 * Handler to retrieve a single color map record from the application database
 */
const getRetrievalCollection = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    const {
      id: providedRetrievalCollectionId
    } = event.pathParameters

    const jwtToken = getJwtToken(event)

    const { token } = getVerifiedJwtToken(jwtToken)
    const username = getUsernameFromToken(token)

    // Retrieve a connection to the database
    dbConnection = await getDbConnection(dbConnection)

    const retrievalResponse = await dbConnection('retrieval_collections')
      .first(
        'retrievals.id AS retrieval_id',
        'retrievals.jsondata',
        'retrievals.environment',
        'retrieval_collections.id',
        'access_method',
        'collection_id',
        'collection_metadata',
        'granule_params',
        'granule_count'
      )
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrieval_collections.id': providedRetrievalCollectionId,
        'users.urs_id': username
      })

    if (retrievalResponse) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(retrievalResponse)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [`Retrieval Collection '${providedRetrievalCollectionId}' not found.`] })
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

export default getRetrievalCollection
