import { getDbConnection } from '../util/database/getDbConnection'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Retrieve a shapefile from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getShapefile = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  const { pathParameters } = event
  const {
    id: providedShapefileId
  } = pathParameters

  const decodedShapefileId = deobfuscateId(
    providedShapefileId,
    process.env.obfuscationSpinShapefiles
  )

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    const existingShapefileRecord = await dbConnection('shapefiles')
      .first(
        'file',
        'filename',
        'selected_features'
      )
      .where({
        id: decodedShapefileId
      })

    if (existingShapefileRecord && existingShapefileRecord !== null) {
      const {
        file,
        filename,
        selected_features: selectedFeatures
      } = existingShapefileRecord

      const returnObject = {
        file,
        shapefileName: filename
      }

      if (selectedFeatures != null) {
        returnObject.selectedFeatures = selectedFeatures
      }

      // Return the name and path
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify(returnObject)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors: [`Shapefile '${providedShapefileId}' not found.`] })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default getShapefile
