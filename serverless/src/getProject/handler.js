import 'pg'

import { getDbConnection } from '../util/database/getDbConnection'
import { isWarmUp } from '../util/isWarmup'

let dbConnection = null

const getProject = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const params = event.queryStringParameters
  const {
    projectId
  } = params

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  try {
    const existingProjectRecord = await dbConnection('projects')
      .first('name', 'path')
      .where({
        id: projectId
      })

    const { name, path } = existingProjectRecord

    // Return the name and path
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ name, path })
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

export default getProject
