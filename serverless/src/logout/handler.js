import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'

let dbConnection = null

const logout = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const jwtToken = getJwtToken(event)
  const { id: userId } = getVerifiedJwtToken(jwtToken)

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  try {
    const affectedRows = await dbConnection('user_tokens')
      .where({ user_id: userId })
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
      body: JSON.stringify({ errors: [`User token for user '${userId}' not found.`] })
    }
  } catch (error) {
    console.log(error)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({ errors: [error] })
    }
  }
}

export default logout
