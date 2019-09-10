import 'pg'
import forge from 'node-forge'

import { getDbConnection } from '../util/database/getDbConnection'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { isWarmUp } from '../util/isWarmup'

let dbConnection = null

const saveShapefile = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const { body } = event
  const { params } = JSON.parse(body)
  const {
    auth_token: jwtToken,
    file,
    filename
  } = params

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  const fileHash = forge.md.md5.create()
  fileHash.update(JSON.stringify(file))

  try {
    const shapefileSearchOptions = {
      file_hash: fileHash.digest().toHex()
    }
    const shapefileInsertOptions = {
      ...shapefileSearchOptions,
      file,
      filename
    }

    // If user information was included, use it in the queries
    if (jwtToken) {
      const { id: userId } = getVerifiedJwtToken(jwtToken)

      shapefileSearchOptions.user_id = userId
      shapefileInsertOptions.user_id = userId
    }

    // If the shapefile exists, return the ID
    const existingShapefileRecord = await dbConnection('shapefiles').first('id').where(shapefileSearchOptions)

    if (existingShapefileRecord) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ shapefile_id: existingShapefileRecord.id })
      }
    }

    // Save the shapefile and return the ID
    const newShapefileRecord = await dbConnection('shapefiles')
      .returning(['id'])
      .insert(shapefileInsertOptions)

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ shapefile_id: newShapefileRecord[0].id })
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

export default saveShapefile
