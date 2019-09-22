import 'array-foreach-async'
import request from 'request-promise'
import AWS from 'aws-sdk'
import customGibsProducts from '../static/gibs'
import { getClientId } from '../../../sharedUtils/config'
import { getSqsConfig } from '../util/aws/getSqsConfig'
import { tagName } from '../../../sharedUtils/tags'

// AWS SQS adapter
let sqs

/*
 * Retrieve the worldview configuration file and pull out products that Earthdata Search supports
 */
export const getSupportedGibsLayers = async (mergeCustomProducts = true) => {
  const worldviewConfig = 'https://worldview.earthdata.nasa.gov/config/wv.json'
  const worldviewResponse = await request.get({
    uri: worldviewConfig,
    json: true,
    resolveWithFullResponse: true,
    headers: {
      'Client-Id': getClientId().background
    }
  })

  const supportedProjections = [
    'GIBS:antarctic',
    'GIBS:arctic',
    'GIBS:geographic'
  ]

  const { body: worldviewProducts } = worldviewResponse

  // Merge the EDSC custom products into the GIBS products before processing
  if (mergeCustomProducts) {
    Object.keys(customGibsProducts).forEach((key) => {
      console.log(`Merged ${Object.keys(customGibsProducts[key]).length} objects into '${key}'`)

      worldviewProducts[key] = {
        ...worldviewProducts[key],
        ...customGibsProducts[key]
      }
    })
  }

  const { layers, products } = worldviewProducts

  const evaluatedLayers = {}
  await Object.keys(layers).forEachAsync(async (key) => {
    // Prevent `eslint(no-param-reassign)` errors
    const currentLayer = layers[key]

    // Ignore non Web Map Tile Service layers
    if (currentLayer.type !== 'wmts') {
      return
    }

    const { product } = currentLayer

    if (!product) {
      return
    }

    const productObject = products[product]

    // Ensure that we have a product that matches this layer
    if (!productObject) {
      return
    }

    // Overwrites the product (currently just the ID) with the full object
    currentLayer.product = productObject

    const { projections = {} } = currentLayer

    Object.keys(projections).forEach((key) => {
      const projection = projections[key]

      if (!supportedProjections.includes(projection.source)) {
        delete projections[key]
      }
    })

    // Ensure the layer has projections that we support
    if (!projections) {
      return
    }

    evaluatedLayers[key] = currentLayer
  })

  console.log(`Found ${Object.keys(evaluatedLayers).length} supported layer(s) from the ${Object.keys(layers).length} provided by Worldview.`)

  return evaluatedLayers
}

/*
 * Convert a world view configuration object to a CMR search query object
 */
const configToCmrQuery = async (config) => {
  const topLevelConfigs = []

  const supportedCmrQueryKeys = {
    conceptId: 'concept_id',
    dataCenterId: 'provider',
    shortName: 'short_name'
  }
  Object.keys(config).forEach((configKey) => {
    const query = config[configKey]

    // Converts the key from worldview to a cmr search key
    const translatedCmrKey = supportedCmrQueryKeys[configKey]

    if (Object.keys(supportedCmrQueryKeys).includes(configKey)) {
      const queryConditions = [].concat(query)

      if (queryConditions.length > 1) {
        const orCondition = []
        queryConditions.forEach((queryCondition) => {
          orCondition.push({ [translatedCmrKey]: queryCondition })
        })

        topLevelConfigs.push({ or: orCondition })
      } else {
        topLevelConfigs.push({ [translatedCmrKey]: queryConditions[0] })
      }
    }
  })

  if (topLevelConfigs.length > 1) {
    return {
      condition: {
        and: topLevelConfigs
      }
    }
  }

  return {
    condition: topLevelConfigs[0]
  }
}

/*
 * Construct an object from product information provided world view that Earthdata Search can use to tag CMR collections
 */
const constructLayerTagData = async (layer) => {
  const layerTagData = []

  const {
    format,
    group,
    id,
    product,
    projections,
    subtitle,
    title
  } = layer

  const match = {}
  if (layer.startDate) {
    match.time_start = `>=${layer.startDate}`
  }
  if (layer.endDate) {
    match.time_end = `<=${layer.endDate}`
  }
  if (layer.dayNightFlag) {
    match.day_night_flag = layer.dayNightFlag
  }

  const tagData = {
    match,
    product: id,
    group,
    // maxNativeZoom: 5,
    title,
    source: subtitle,
    format: format.split('/').pop()
  }

  const supportedProjections = ['antarctic', 'arctic', 'geographic']
  await supportedProjections.forEachAsync((projection) => {
    const layerProjection = projections[projection]
    if (layerProjection) {
      const resolution = layerProjection.matrixSet.split('_').pop()

      tagData[projection] = true
      tagData[`${projection}_resolution`] = resolution
    } else {
      tagData[projection] = false
      tagData[`${projection}_resolution`] = null
    }
  })

  const { query } = product
  const {
    nrt,
    science
  } = query

  if (nrt || science) {
    await Object.keys(query).forEachAsync((queryKey) => {
      layerTagData.push({
        collection: configToCmrQuery(query[queryKey]),
        data: tagData
      })
    })
  } else {
    layerTagData.push({
      collection: configToCmrQuery(query),
      data: tagData
    })
  }

  return layerTagData
}

/**
 * Handler to process product information from world view and tag CMR collections
 */
const generateGibsTags = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  if (sqs == null) {
    sqs = new AWS.SQS(getSqsConfig())
  }

  // The headers we'll send back regardless of our response
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }

  const supportedGibsLayers = await getSupportedGibsLayers()

  const layerTagData = []

  await Object.keys(supportedGibsLayers).forEachAsync(async (key) => {
    const gibsLayer = supportedGibsLayers[key]

    const layerConfigs = await constructLayerTagData(gibsLayer)

    layerTagData.push(...layerConfigs)
  })

  // As we iterate through all the layerTagDatas we'll keep track of
  // each individual configuration; we'll then tell CMR to delete tags on
  // any collection that does match the compiled configurations
  const allTagConditions = []

  await layerTagData.forEachAsync(async (configuration) => {
    const { collection: searchCriteria, data: tagData } = configuration

    try {
      const { collection = {} } = configuration
      const { condition = {} } = collection

      await sqs.sendMessage({
        QueueUrl: process.env.tagQueueUrl,
        MessageBody: JSON.stringify({
          tagName: tagName('gibs'),
          action: 'ADD',
          append: true,
          requireGranules: false,
          searchCriteria,
          tagData
        })
      }).promise()

      allTagConditions.push(condition)
    } catch (e) {
      console.log(e)
    }
  })

  try {
    // Remove stale tags
    await sqs.sendMessage({
      QueueUrl: process.env.tagQueueUrl,
      MessageBody: JSON.stringify({
        tagName: tagName('gibs'),
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            and: [
              {
                tag: {
                  tag_key: tagName('gibs')
                }
              },
              {
                not: {
                  or: allTagConditions
                }
              }
            ]
          }
        }
      })
    }).promise()
  } catch (e) {
    console.log(e)
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(allTagConditions)
  }
}

export default generateGibsTags
