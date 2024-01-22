import { getDbConnection } from '../util/database/getDbConnection'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Retrieve single colormap record from the database
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
export default async function getColorMap(event, context) {
  const { defaultResponseHeaders } = getApplicationConfig()
  const { disableDatabase } = process.env

  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    const { product: providedProduct } = event.pathParameters

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    const colorMapResponse = await dbConnection('colormaps')
      .first('jsondata')
      .where({ product: providedProduct })

    if (colorMapResponse) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify(colorMapResponse.jsondata)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors: [`ColorMap '${providedProduct}' not found.`] })
    }
  } catch (error) {
    const regex = /connect ECONNREFUSED/
    const dbConnectionError = regex.test(error.message)
    console.log('🚀 ~ file: handler.js:48 ~ getColorMap ~ disableDatabase:', disableDatabase)
    // Todo how should we handle this error I guess disregard it
    if (dbConnectionError && disableDatabase) {
      console.log('Caught the error ✅')
      console.log('🚀 ~ file: handler.js:57 ~ getColorMap ~ parseError(error):', parseError(error))
      const colorMapsDisabledMessage = 'Colormaps are currently disabled during maintenance period'

      return {
        isBase64Encoded: false,
        statusCode: 404,
        headers: defaultResponseHeaders,
        ...parseError(colorMapsDisabledMessage, {
        })
      }
    }

    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}
