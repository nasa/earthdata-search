import 'pg'
import md5 from 'md5'

import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { getDbConnection } from '../util/database/getDbConnection'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Saves a shapefile to the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const saveShapefile = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const { body } = event

  const { params } = JSON.parse(body)

  const {
    authToken,
    file,
    filename
  } = params

  const earthdataEnvironment = deployedEnvironment()

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const fileHash = md5(JSON.stringify(file))

  try {
    const shapefileSearchOptions = {
      file_hash: fileHash
    }
    const shapefileInsertOptions = {
      ...shapefileSearchOptions,
      file,
      filename
    }

    // If user information was included, use it in the queries
    if (authToken) {
      const { id: userId } = getVerifiedJwtToken(authToken, earthdataEnvironment)

      shapefileSearchOptions.user_id = userId
      shapefileInsertOptions.user_id = userId
    }

    // If the shapefile exists, return the ID
    const existingShapefileRecord = await dbConnection('shapefiles').first('id').where(shapefileSearchOptions)

    if (existingShapefileRecord) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify({
          shapefile_id: obfuscateId(
            existingShapefileRecord.id,
            process.env.OBFUSCATION_SPIN_SHAPEFILES
          )
        })
      }
    }

    // Save the shapefile and return the ID
    const newShapefileRecord = await dbConnection('shapefiles')
      .returning(['id'])
      .insert(shapefileInsertOptions)

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        shapefile_id: obfuscateId(newShapefileRecord[0].id, process.env.OBFUSCATION_SPIN_SHAPEFILES)
      })
    }
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default saveShapefile
