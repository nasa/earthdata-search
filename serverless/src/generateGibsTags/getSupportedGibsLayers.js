import 'array-foreach-async'
import axios from 'axios'

import { getClientId } from '../../../sharedUtils/getClientId'

/*
 * Retrieve the worldview configuration file and pull out products that Earthdata Search supports
 */
export const getSupportedGibsLayers = async () => {
  const worldviewConfig = 'https://worldview.earthdata.nasa.gov/config/wv.json'
  const worldviewResponse = await axios({
    method: 'get',
    url: worldviewConfig,
    headers: {
      'Client-Id': getClientId().background
    }
  })

  const projectionMap = {
    epsg4326: 'GIBS:geographic',
    epsg3413: 'GIBS:arctic',
    epsg3031: 'GIBS:antarctic'
  }

  const supportedProjections = Object.values(projectionMap)

  const { data: worldviewProducts } = worldviewResponse

  const { layers } = worldviewProducts

  const evaluatedLayers = {}

  Object.keys(layers).forEach((key) => {
    const { [key]: currentLayer } = layers

    const { conceptIds, projections, type } = currentLayer

    // Ignore non Web Map Tile Service layers
    if (type !== 'wmts') {
      return
    }

    // If no concept id is found in this object there are not
    // collections associated with it and we can ignore it
    if (!conceptIds) {
      return
    }

    Object.keys(projections).forEach((key) => {
      const projection = projections[key]

      if (!supportedProjections.includes(projection.source)) {
        delete projections[key]
      }
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
