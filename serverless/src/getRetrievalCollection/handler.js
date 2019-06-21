import 'pg'
import jwt from 'jsonwebtoken'
import { getSecretEarthdataConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util'

// Knex database connection object
let dbConnection = null

/**
 * Handler to retrieve a single color map record from the application database
 */
export default async function getRetrieval(event, context) {
  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    const {
      retrieval_id: providedRetrieval,
      collection_id: providedCollection
    } = event.pathParameters

    const jwtToken = getJwtToken(event)

    // Get the access token and clientId to build the Echo-Token header
    const { secret } = getSecretEarthdataConfig('prod')

    const verifiedJwtToken = jwt.verify(jwtToken, secret)
    const { token } = verifiedJwtToken
    const { endpoint } = token
    const username = endpoint.split('/').pop()

    // Retrive a connection to the database
    dbConnection = await getDbConnection(dbConnection)

    const retrievalResponse = await dbConnection('retrieval_collections')
      .first(
        'retrievals.environment',
        'access_method',
        'collection_metadata',
        'granule_params',
        'granule_count'
      )
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .join('users', { 'retrievals.user_id': 'users.id' })
      .where({
        'retrieval_collections.collection_id': providedCollection,
        'retrievals.id': providedRetrieval,
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
      body: JSON.stringify({ errors: [`Retrieval Collection '${providedCollection}' (for Retrieval '${providedRetrieval}') not found.`] })
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
