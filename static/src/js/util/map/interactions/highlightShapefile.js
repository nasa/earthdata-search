import spatialTypes from '../../../constants/spatialTypes'
import findShapefileFeature from './findShapefileFeature'
import {
  hoveredMarkerStyle,
  shapefileHoverStyle,
  unselectedMarkerStyle,
  unselectedShapefileStyle
} from '../styles'

/**
 * Highlight a shapefile feature based on the coordinate
 * @param {Object} params
 * @param {Array} params.coordinate - The coordinate to search for a feature
 * @param {Object} params.map - The OpenLayers map object
 * @param {Object} params.spatialDrawingSource - The source to search for the feature
 */
const highlightShapefile = ({
  coordinate,
  map,
  spatialDrawingSource
}) => {
  const feature = findShapefileFeature({
    coordinate,
    map,
    source: spatialDrawingSource
  })

  if (!feature) {
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
        sourceFeature.setStyle(unselectedMarkerStyle)
      } else {
        sourceFeature.setStyle(unselectedShapefileStyle)
      }
    })

    return
  }

  // Set the cursor to a pointer
  document.body.style.cursor = 'pointer'

  const { geometryType, selected } = feature.getProperties()

  // If the feature is already selected, return
  if (selected) return

  // Set the style of the feature
  if (geometryType === spatialTypes.POINT) {
    feature.setStyle(hoveredMarkerStyle)
  } else {
    feature.setStyle(shapefileHoverStyle)
  }
}

export default highlightShapefile
