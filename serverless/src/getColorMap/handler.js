import { getDbConnection } from '../util/database/getDbConnection'

// Knex database connection object
let dbConnection = null

/**
 * Handler to retrieve a single color map record from the application database
 */
export default async function getColorMap(event, context) {
  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false

    const { product: providedProduct } = event.pathParameters

    // Retrieve a connection to the database
    dbConnection = await getDbConnection(dbConnection)

    const colorMapResponse = await dbConnection('colormaps')
      .first('jsondata')
      .where({ product: providedProduct })

    if (colorMapResponse) {
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(colorMapResponse.jsondata)
      }
    }

    return {
      isBase64Encoded: false,
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ errors: [`ColorMap '${providedProduct}' not found.`] })
    }
  } catch (e) {
    console.log(e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true

      },
      body: JSON.stringify({ errors: [e] })
    }
  }
}
