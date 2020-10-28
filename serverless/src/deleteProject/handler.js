import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Delete a project from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const deleteProject = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = deployedEnvironment()

  const jwtToken = getJwtToken(event)

  const { id: userId } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

  const { pathParameters } = event
  const {
    id: providedProjectId
  } = pathParameters

  const decodedProjectId = deobfuscateId(providedProjectId)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const affectedRows = await dbConnection('projects')
      .where({
        user_id: userId,
        id: decodedProjectId
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
      body: JSON.stringify({ errors: [`Project '${providedProjectId}' not found.`] })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: {
        ...defaultResponseHeaders,
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      ...parseError(e)
    }
  }
}

export default deleteProject
