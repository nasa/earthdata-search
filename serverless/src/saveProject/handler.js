import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Saves a project to the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const saveProject = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event

  const { params } = JSON.parse(body)

  const {
    authToken,
    name = '',
    path,
    projectId
  } = params

  const earthdataEnvironment = deployedEnvironment()

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  let newProjectId

  try {
    let userId
    // If user information was included, use it in the queries
    if (authToken) {
      const { username } = getVerifiedJwtToken(authToken, earthdataEnvironment)

      const userRecord = await dbConnection('users').first('id').where({ urs_id: username })

      const { id } = userRecord
      userId = id
    }

    // If there is a previous projectId, update that project
    if (projectId) {
      const deobfuscatedProjectId = deobfuscateId(projectId)

      const existingProjectRecord = await dbConnection('projects')
        .first('id')
        .where({
          id: deobfuscatedProjectId,
          user_id: userId || null
        })

      if (existingProjectRecord) {
        // Update the project record
        await dbConnection('projects')
          .update({
            name,
            path
          })
          .where({ id: existingProjectRecord.id })

        newProjectId = existingProjectRecord.id
      } else {
        // An existingProjectRecord doesn't exist, probably because the userId doesn't match
        // Create a new record
        const newProjectRecord = await dbConnection('projects')
          .returning(['id'])
          .insert({
            user_id: userId,
            name,
            path
          })

        newProjectId = newProjectRecord[0].id
      }
    } else {
      // Save the project and return the ID
      const newProjectRecord = await dbConnection('projects')
        .returning(['id'])
        .insert({
          user_id: userId,
          name,
          path
        })

      newProjectId = newProjectRecord[0].id
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        name,
        path,
        project_id: obfuscateId(newProjectId)
      })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default saveProject
