import 'array-foreach-async'
import 'pg'
import jwt from 'jsonwebtoken'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util'

import { getSecretEarthdataConfig } from '../../../sharedUtils/config'

// Knex database connection object
let dbConnection = null

const submitOrder = async (event) => {
  const { body } = event
  const { collections, environment } = body

  const jwtToken = getJwtToken(event)

  // Get the access token and clientId to build the Echo-Token header
  const { secret } = getSecretEarthdataConfig('prod')

  const verifiedJwtToken = jwt.verify(jwtToken, secret)
  const { token } = verifiedJwtToken
  const { endpoint, access_token: accessToken } = token
  const username = endpoint.split('/').pop()

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  const trx = await dbConnection.transaction()

  try {
    const userRecord = await trx('users').first('id').where({ urs_id: username })

    const retrievalRecord = await trx('retrievals').returning(['id', 'user_id', 'environment'])
      .insert({
        user_id: userRecord.id,
        environment,
        token: accessToken
      })


    await collections.forEachAsync(async (collection) => {
      const {
        id,
        access_method: accessMethod,
        granule_count: granuleCount,
        granule_params: granuleParams
      } = collection

      await trx('retrieval_collections').returning(['id'])
        .insert({
          retrieval_id: retrievalRecord.id,
          access_method: accessMethod,
          collection_id: id,
          granule_params: granuleParams,
          granule_count: granuleCount
        })
    })

    await trx.commit()


    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(retrievalRecord)
    }
  } catch (e) {
    console.log(e)

    // On error rollback our transaction
    trx.rollback()

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default submitOrder
