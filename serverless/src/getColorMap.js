import 'pg'
import { getDbConnection } from './util'

// Knex database connection object
let dbConnection = null

/**
 * Retrieve a single ColorMap
 * @param {object} event The Lambda event body
 * @param {object} context AWS Lambda execution context
 */
export default async function getColorMap(event, context) {
  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line
    context.callbackWaitsForEmptyEventLoop = false

    const { product: providedProduct } = event.pathParameters

    // Retrive a connection to the database
    dbConnection = await getDbConnection(dbConnection)

    const colorMapResponse = await dbConnection('colormaps')
      .first('jsondata')
      .where({ product: providedProduct })

    if (colorMapResponse) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(colorMapResponse.jsondata)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [`ColorMap '${providedProduct}' not found.`] })
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
