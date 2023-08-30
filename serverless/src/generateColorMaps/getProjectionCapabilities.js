import 'array-foreach-async'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { getDbConnection } from '../util/database/getDbConnection'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { parseError } from '../../../sharedUtils/parseError'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
})

// Name of the db table that this lambda operates on
const colorMapsTableName = 'colormaps'

// AWS SQS client
let sqsClient

/**
 * Parse the GIBS capabilities document and provide individual ColorMaps to SQS for further processing
 * @param {String} projection - The projection used to determine which GIBS file to examine
 * @return {Object} An object containing a valid response code and a JSON body
 */
export const getProjectionCapabilities = async (projection) => {
  const capabilitiesUrl = `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities`

  try {
    if (!sqsClient) {
      sqsClient = new SQSClient(getSqsConfig())
    }

    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // Delete colormaps that havent been updated in the last 5 days
    await dbConnection(colorMapsTableName).whereRaw("updated_at <= now() - INTERVAL '5 DAYS'").del()

    const colormapProducts = []

    const gibsResponse = await axios.get(capabilitiesUrl)

    const parsedCapabilities = xmlParser.parse(gibsResponse.data)

    const { Capabilities: capabilities = {} } = parsedCapabilities
    const { Contents: contents = {} } = capabilities
    let { Layer: capabilityLayers = [] } = contents

    capabilityLayers = [].concat(capabilityLayers).filter(Boolean)

    console.log(`Found ${capabilityLayers.length} layers within GIBS`)

    await capabilityLayers.forEachAsync(async (layer) => {
      let knownColorMap = await dbConnection(colorMapsTableName)
        .first('id', 'product', 'url')
        .where({ product: layer['ows:Identifier'] })

      const metadataLinks = layer['ows:Metadata'] || []
      console.log('metadataLinks', metadataLinks)
      await metadataLinks.filter(Boolean).forEachAsync(async (link) => {
        console.log('looking for a link')
        // Look for the v1.3 colormap link
        if (link['xlink:role'].includes('1.3')) {
          // If there is no previous record of this product, insert a new row into the database
          if (knownColorMap == null) {
            [knownColorMap] = await dbConnection(colorMapsTableName)
              .returning(['id', 'product', 'url'])
              .insert({
                product: layer['ows:Identifier'],
                url: link['xlink:href']
              })

            console.log('knownColorMap', knownColorMap)
          }

          console.log('sending message', JSON.stringify(knownColorMap))
          const sendMessageCommand = new SendMessageCommand({
            QueueUrl: process.env.colorMapQueueUrl,
            MessageBody: JSON.stringify(knownColorMap)
          })

          await sqsClient.send(sendMessageCommand)
        }
      })

      if (knownColorMap) {
        const { product } = knownColorMap
        colormapProducts.push(product)
      }
    })

    console.log(`Successfully processed ${colormapProducts.length} colormaps`)

    return {
      statusCode: gibsResponse.status,
      body: JSON.stringify(colormapProducts)
    }
  } catch (e) {
    return parseError(e)
  }
}
