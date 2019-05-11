import 'pg'
import knex from 'knex'

const connection = knex({
  client: 'pg',
  connection: {
    host: process.env.dbEndpoint,
    user: process.env.dbUsername,
    password: process.env.dbPassword,
    database: process.env.dbName,
    port: 5432
  }
})

export default function getColorMap(event, context, callback) {
  try {
    // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
    // eslint-disable-next-line
    context.callbackWaitsForEmptyEventLoop = false

    const providedProduct = event.pathParameters.product
    console.log(providedProduct)


    connection('colormaps')
      .first('jsondata')
      .where({ product: providedProduct })
      .then((rows) => {
        callback(null, {
          isBase64Encoded: false,
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(rows.jsondata)
        })
      })
      .catch((e) => {
        console.log(e)

        callback(null, {
          isBase64Encoded: false,
          statusCode: 404,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ errors: [`ColorMap '${providedProduct}' not found.`] })
        })
      })
  } catch (e) {
    callback(null, {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errors: [e] })
    })
  }
}
