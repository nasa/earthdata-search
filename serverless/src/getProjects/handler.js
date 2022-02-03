import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Handler for retreiving a users projects
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getProjects = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = deployedEnvironment()

  const jwtToken = getJwtToken(event)

  const { username } = getVerifiedJwtToken(jwtToken, earthdataEnvironment)

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const projectRecords = await dbConnection('projects')
      .select(
        'projects.id',
        'projects.name',
        'projects.path',
        'projects.created_at'
      )
      .join('users', { 'projects.user_id': 'users.id' })
      .orderBy('projects.created_at', 'DESC')
      .where({
        'users.urs_id': username
      })

    // Return the name and path
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify([
        ...projectRecords.map((project) => {
          const { id } = project

          return {
            ...project,
            id: obfuscateId(id)
          }
        })
      ])
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getProjects
