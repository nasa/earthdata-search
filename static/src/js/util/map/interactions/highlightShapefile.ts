import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'

import spatialTypes from '../../../constants/spatialTypes'
import findShapefileFeature from './findShapefileFeature'
import {
  hoveredShapefileMarkerStyle,
  hoveredShapefileStyle,
  unselectedShapefileMarkerStyle,
  unselectedShapefileStyle
} from '../styles'

export const unhighlightShapefile = (spatialDrawingSource: VectorSource) => {
  // Reset the cursor
  document.body.style.cursor = 'auto'

  // Reset the style of each feature
  spatialDrawingSource.forEachFeature((sourceFeature) => {
    const {
      geometryType,
      isShapefile,
      selected
    } = sourceFeature.getProperties()

    if (selected || !isShapefile) return

    if (geometryType === spatialTypes.POINT) {
      sourceFeature.setStyle(unselectedShapefileMarkerStyle)
    } else {
      sourceFeature.setStyle(unselectedShapefileStyle)
    }
  })
}

/**
 * Highlight a shapefile feature based on the coordinate
 * @param {Object} params
 * @param {Array} params.coordinate - The coordinate to search for a feature
 * @param {Object} params.map - The OpenLayers map object
 * @param {Object} params.spatialDrawingSource - The source to search for the feature
 */
export const highlightShapefile = ({
  coordinate,
  map,
  spatialDrawingSource
}: {
  /** The coordinate to search for a feature */
  coordinate: number[]
  /** The map */
  map: Map
  /** The source to search for the feature */
  spatialDrawingSource: VectorSource
}) => {
  const feature = findShapefileFeature({
    coordinate,
    map,
    source: spatialDrawingSource
  })

  if (!feature) {
    unhighlightShapefile(spatialDrawingSource)

    return
  }

  // Set the cursor to a pointer
  document.body.style.cursor = 'pointer'

  const { geometryType, selected } = feature.getProperties()

  // If the feature is already selected, return
  if (selected) return

  // Set the style of the feature
  if (geometryType === spatialTypes.POINT) {
    feature.setStyle(hoveredShapefileMarkerStyle)
  } else {
    feature.setStyle(hoveredShapefileStyle)
  }
}
