import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'

import spatialTypes from '../../../constants/spatialTypes'

/**
 * Find a shapefile feature based on the coordinate. If the feature is a line or point a buffer is applied to the coordinate to find the feature.
 * @param {Object} params
 * @param {Array} params.coordinate - The coordinate to search for a feature
 * @param {Object} params.map - The OpenLayers map object
 * @param {Object} params.source - The source to search for the feature
 */
const findShapefileFeature = ({
  coordinate,
  map,
  source
}: {
  /** The coordinate to search for a feature */
  coordinate: number[],
  /** The map */
  map: Map,
  /** The source to search for the feature */
  source: VectorSource
}) => {
  const feature = source.getClosestFeatureToCoordinate(coordinate)

  // If there is no feature, return
  if (!feature) return false

  const isShapefile = feature.get('isShapefile')
  if (!isShapefile) return false

  const geometryType = feature.get('geometryType')

  // If the feature is a point or line, we need to check if the coordinate is close
  // to the feature, not within it
  const closeEnoughTypes = [spatialTypes.POINT, spatialTypes.MULTI_POINT, spatialTypes.LINE_STRING]

  // Is the coordinate actually within, or close enough to, the feature?
  let isWithinFeature
  if (closeEnoughTypes.includes(geometryType)) {
    // Create an extent around the coordinate, to provide a way to find point and line features

    // Create a 5 pixel buffer around the coordinate. This will change the extent size based
    // on the zoom level.
    const bufferPixels = 5
    const pixel1 = map.getPixelFromCoordinate(coordinate)
    const pixel2 = [
      pixel1[0] + bufferPixels,
      pixel1[1] + bufferPixels
    ]

    // Get the map coordinates from the pixels
    const coordinate2 = map.getCoordinateFromPixel(pixel2)

    // Get the buffer distance in map units
    const buffer = Math.abs(coordinate[0] - coordinate2[0])

    // Create an extent around the mouse coordinate
    const coordinateExtent = [
      coordinate[0] - buffer,
      coordinate[1] - buffer,
      coordinate[0] + buffer,
      coordinate[1] + buffer
    ]

    isWithinFeature = feature.getGeometry()?.intersectsExtent(coordinateExtent)
  } else {
    isWithinFeature = feature.getGeometry()?.intersectsCoordinate(coordinate)
  }

  // If the coordinate is not within the feature, return
  if (!isWithinFeature) return false

  return feature
}

export default findShapefileFeature
