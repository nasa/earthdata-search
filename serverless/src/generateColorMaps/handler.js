import 'array-foreach-async'
import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import AWS from 'aws-sdk'
import { getDbConnection } from '../util/database/getDbConnection'
import { getClientId } from '../../../sharedUtils/config'

// Knex database connection object
let dbConnection = null

// Name of the db table that this lambda operates on
const colorMapsTableName = 'colormaps'

// AWS SQS adapter
let sqs

/**
 * Parse the GIBS capabilities document and provide individual ColorMaps to SQS for further processing
 * @param {String} projection - The projection used to determine which GIBS file to examine
 * @return {Object} An object containing a valid response code and a JSON body
 */
const getProjectionCapabilities = async (projection) => {
  sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

  const capabilitiesUrl = `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities`

  console.log(`GIBS Capabilties URL: ${capabilitiesUrl}`)

  try {
    // Retrieve a connection to the database
    dbConnection = await getDbConnection(dbConnection)

    // Delete colormaps that havent been updated in the last 5 days
    await dbConnection(colorMapsTableName).whereRaw("updated_at <= now() - INTERVAL '5 DAYS'").del()

    const colormapUrls = []

    const gibsResponse = await request.get({
      uri: capabilitiesUrl,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().background
      }
    })

    const parsedCapabilities = parseXml(gibsResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const { Capabilities: capabilities = {} } = parsedCapabilities
    const { Contents: contents = {} } = capabilities
    const { Layer: capabilityLayers = [] } = contents

    await capabilityLayers.filter(Boolean).forEachAsync(async (layer) => {
      let knownColorMap = await dbConnection(colorMapsTableName)
        .first('id', 'product', 'url')
        .where({ product: layer['ows:Identifier'] })

      const metadataLinks = layer['ows:Metadata'] || []
      await metadataLinks.filter(Boolean).forEachAsync(async (link) => {
        // Look for the v1.3 colormap link
        if (link['xlink:role'].includes('1.3')) {
          // If there is no previous record of this product, insert a new row into the database
          if (knownColorMap === undefined) {
            knownColorMap = await dbConnection(colorMapsTableName)
              .returning(['id', 'product', 'url'])
              .insert({
                product: layer['ows:Identifier'],
                url: link['xlink:href']
              })
          }

          try {
            sqs.sendMessage({
              QueueUrl: process.env.colorMapQueueUrl,
              MessageBody: JSON.stringify(knownColorMap)
            }).promise()
          } catch (e) {
            console.log(e)
          }
        }
      })
    })

    return {
      statusCode: gibsResponse.statusCode,
      body: colormapUrls
    }
  } catch (e) {
    console.log(e)

    if (e.response) {
      return {
        statusCode: e.statusCode,
        body: JSON.stringify({ errors: [e.response.body] })
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ errors: [e] })
    }
  }
}

/**
 * Handler to process colormap records from GIBS
 */
export default async function generateColorMaps(event, context) {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // The headers we'll send back regardless of our response
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }

  const projectionCapabilities = await getProjectionCapabilities(event.projection)

  console.log(`Completed Capabilities request with status ${projectionCapabilities.statusCode}.`)

  if (projectionCapabilities.statusCode !== 200) {
    return {
      isBase64Encoded: false,
      statusCode: projectionCapabilities.statusCode,
      headers: responseHeaders,
      body: projectionCapabilities.body
    }
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(projectionCapabilities.body)
  }
}
