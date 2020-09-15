import 'array-foreach-async'
import axios from 'axios'
import forge from 'node-forge'

import { constructOrderPayload } from './constructOrderPayload'
import { constructOrderUrl } from './constructOrderUrl'
import { createLimitedShapefile } from '../util/createLimitedShapefile'
import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { getDbConnection } from '../util/database/getDbConnection'
import { getEdlConfig } from '../util/configUtil'
import { parseError } from '../../../sharedUtils/parseError'
import { startOrderStatusUpdateWorkflow } from '../util/startOrderStatusUpdateWorkflow'

/**
 * Submits an order to Harmony
 * @param {Object} event Queue messages from SQS
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const submitHarmonyOrder = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Retrieve a connection to the database
  const dbConnection = await getDbConnection()

  const { Records: sqsRecords = [] } = event

  if (sqsRecords.length === 0) return

  console.log(`Processing ${sqsRecords.length} order(s)`)

  await sqsRecords.forEachAsync(async (sqsRecord) => {
    const { body } = sqsRecord

    // Destruct the payload from SQS
    const {
      accessToken,
      id
    } = JSON.parse(body)

    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    const accessTokenWithClient = `${accessToken}:${clientId}`

    // Fetch the retrieval id that the order belongs to so that we can provide a link to the status page
    const retrievalRecord = await dbConnection('retrieval_orders')
      .first(
        'retrievals.id',
        'retrievals.jsondata',
        'retrieval_collections.access_method',
        'retrieval_collections.collection_id',
        'retrieval_orders.granule_params'
      )
      .join('retrieval_collections', { 'retrieval_orders.retrieval_collection_id': 'retrieval_collections.id' })
      .join('retrievals', { 'retrieval_collections.retrieval_id': 'retrievals.id' })
      .where({
        'retrieval_orders.id': id
      })

    const {
      access_method: accessMethod,
      collection_id: collectionId,
      granule_params: granuleParams,
      jsondata,
      user_id: userId
    } = retrievalRecord

    const {
      type
    } = accessMethod

    const {
      shapefileId,
      selectedFeatures
    } = jsondata

    // Retrieve the shapefile if one was provided
    let file
    if (shapefileId) {
      const deobfuscatedShapefileId = deobfuscateId(
        shapefileId,
        process.env.obfuscationSpinShapefiles
      )

      const shapefileRecord = await dbConnection('shapefiles')
        .first('file', 'filename')
        .where({ id: deobfuscatedShapefileId });

      ({ file } = shapefileRecord)

      // If selectedFeatures exists, build a new shapefile out of those features and use the new shapefile to submit order
      if (selectedFeatures) {
        // Create a new shapefile
        const newFile = createLimitedShapefile(file, selectedFeatures)
        file = newFile

        const fileHash = forge.md.md5.create()
        fileHash.update(JSON.stringify(file))

        // If the user already used this file, don't save the file again
        const existingShapefileRecord = await dbConnection('shapefiles')
          .first('id')
          .where({
            file_hash: fileHash,
            user_id: userId
          })

        if (!existingShapefileRecord) {
          const { filename } = shapefileRecord

          // Save new shapefile into database, adding the parent_shapefile_id
          await dbConnection('shapefiles')
            .insert({
              file_hash: fileHash.digest().toHex(),
              file,
              filename: `Limited-${filename}`,
              parent_shapefile_id: deobfuscatedShapefileId,
              selected_features: selectedFeatures,
              user_id: userId
            })
        }
      }
    }

    try {
      const constructedHarmonyUrl = constructOrderUrl(collectionId, accessMethod)

      const orderPayload = await constructOrderPayload({
        accessMethod,
        granuleParams,
        accessTokenWithClient,
        shapefile: file
      })

      const orderResponse = await axios({
        method: 'post',
        url: constructedHarmonyUrl,
        data: orderPayload.stream, // Set internal stream as request body
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...orderPayload.headers // Set headers (Content-Type) of the current FormData instance include the Boundary
        },
        maxRedirects: 1
      })

      const { data } = orderResponse
      const { jobID: orderId } = data

      if (orderId) {
        await dbConnection('retrieval_orders').update({
          order_number: orderId,
          state: 'initialized',
          order_information: data
        }).where({ id })

        // Start the order status check workflow
        await startOrderStatusUpdateWorkflow(id, accessTokenWithClient, type)
      }
    } catch (e) {
      const parsedErrorMessage = parseError(e, { asJSON: false })

      const [errorMessage] = parsedErrorMessage

      await dbConnection('retrieval_orders').update({
        state: 'create_failed'
      }).where({ id })

      // Re-throw the error so the state machine handles the error correctly
      throw Error(errorMessage)
    }
  })
}

export default submitHarmonyOrder
