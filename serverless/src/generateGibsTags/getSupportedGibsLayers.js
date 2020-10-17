import 'array-foreach-async'
import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'

import customGibsProducts from '../static/gibs'
import { getClientId } from '../../../sharedUtils/getClientId'

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

  const projectionMap = {
    epsg4326: 'GIBS:geographic',
    epsg3413: 'GIBS:arctic',
    epsg3031: 'GIBS:antarctic'
  }

  const capabilitiesMatrixSets = {}

  // For each projection, parse the capabilities document and pull out TileMatrixSet for each resolution
  await Object.keys(projectionMap).forEachAsync(async (projection) => {
    const capabilitiesUrl = `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities`
    const capabilitiesResponse = await request.get({
      uri: capabilitiesUrl,
      resolveWithFullResponse: true
    })

    const parsedCapabilities = parseXml(capabilitiesResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const { Capabilities: capabilities = {} } = parsedCapabilities
    const { Contents: contents = {} } = capabilities
    let { TileMatrixSet: capabilityTileMatrixSets = [] } = contents
    capabilityTileMatrixSets = [].concat(capabilityTileMatrixSets).filter(Boolean)

    const matrixLimits = {}
    capabilityTileMatrixSets.forEach((matrixSet) => {
      const { 'ows:Identifier': resolution } = matrixSet
      let { TileMatrix: tileMatrix = [] } = matrixSet
      tileMatrix = [].concat(tileMatrix).filter(Boolean)

      const resolutionMap = {}
      tileMatrix.forEach((matrix) => {
        const {
          'ows:Identifier': id,
          MatrixWidth: matrixWidth,
          MatrixHeight: matrixHeight
        } = matrix

        resolutionMap[id] = {
          matrixWidth,
          matrixHeight
        }
      })

      matrixLimits[resolution] = resolutionMap
    })

    capabilitiesMatrixSets[projectionMap[projection]] = matrixLimits
  })

  const supportedProjections = Object.values(projectionMap)

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
  Object.keys(layers).forEach((key) => {
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

      currentLayer.matrixLimits = capabilitiesMatrixSets[projection.source]
    })

    // Ensure the layer has projections that we support
    if (Object.keys(projections).length === 0) {
      return
    }

    evaluatedLayers[key] = currentLayer
  })

  console.log(`Found ${Object.keys(evaluatedLayers).length} supported layer(s) from the ${Object.keys(layers).length} provided by Worldview.`)

  return evaluatedLayers
}
