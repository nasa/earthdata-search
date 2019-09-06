import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'
import { getJwtToken } from '../util/getJwtToken'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { obfuscateId } from '../util/obfuscation/obfuscateId'

let dbConnection = null

const deleteProject = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const jwtToken = getJwtToken(event)

  const { token } = getVerifiedJwtToken(jwtToken)
  const username = getUsernameFromToken(token)

  const { pathParameters } = event
  const {
    id
  } = pathParameters

  const decodedProjectId = deobfuscateId(id)

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  try {
    const userRecord = await dbConnection('users').first('id').where({ urs_id: username })

    const { id } = userRecord
    const userId = id

    await dbConnection('projects')
      .where({
        user_id: userId,
        id: decodedProjectId
      })
      .del()

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
      headers: { 'Access-Control-Allow-Origin': '*' },
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
  } catch (error) {
    console.log(error)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [error] })
    }
  }
}

export default deleteProject
