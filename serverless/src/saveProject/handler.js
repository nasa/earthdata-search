import { getDbConnection } from '../util/database/getDbConnection'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'
import { isWarmUp } from '../util/isWarmup'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'

let dbConnection = null

const saveProject = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const { body } = event
  const { params } = JSON.parse(body)
  const {
    auth_token: jwtToken,
    name = '',
    path,
    project_id: projectId
  } = params

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  let newProjectId

  try {
    let userId
    // If user information was included, use it in the queries
    if (jwtToken) {
      const { token } = getVerifiedJwtToken(jwtToken)
      const username = getUsernameFromToken(token)

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
        // ExistingProjectRecord doesn't exist, probably because the userId doesn't match
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
  } catch (error) {
    console.log(error)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [error] })
    }
  }

  // Return the projectId and path
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      name,
      path,
      project_id: obfuscateId(newProjectId)
    })
  }
}

export default saveProject
