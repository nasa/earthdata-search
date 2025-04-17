import { Feature } from 'ol'
import { transform } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import Polygon, { circular } from 'ol/geom/Polygon'

import { booleanClockwise, simplify } from '@turf/turf'

import {
  mbrStyle,
  spatialSearchMarkerStyle,
  spatialSearchStyle,
  unselectedShapefileMarkerStyle,
  unselectedShapefileStyle
} from './styles'
import { crsProjections } from './crs'
import getQueryFromShapefileFeature from './getQueryFromShapefileFeature'
import projectionCodes from '../../constants/projectionCodes'

import { eventEmitter } from '../../events/events'

import { mapEventTypes } from '../../constants/eventTypes'
import spatialTypes from '../../constants/spatialTypes'

const MAX_POLYGON_SIZE = 50

// Simplify the shape if it has too many points
const simplifyShape = ({
  geometry,
  onToggleTooManyPointsModal,
  shapefileAdded
}) => {
  let simplifiedGeometry = geometry.clone()

  const coordinates = geometry.getFlatCoordinates()
  let numPoints = coordinates.length / 2

  // If the shapefile was added and the shape has too many points, show a modal
  if (shapefileAdded && numPoints > MAX_POLYGON_SIZE) {
    onToggleTooManyPointsModal(true)
  }

  let tolerance = 0.001
  let previousNumPoints = numPoints

  while (numPoints > MAX_POLYGON_SIZE) {
    // Take OpenLayers geometry and create a turf.js geometry to simplify
    const turfGeometry = new GeoJSON().writeGeometryObject(geometry)

    // Simplify the geometry, increasing the tolerance each time
    const simplified = simplify(turfGeometry, {
      tolerance: tolerance += 0.002,
      highQuality: true
    })

    // Ensure the simplified geometry is counter-clockwise
    if (booleanClockwise(simplified.coordinates[0])) {
      simplified.coordinates[0] = simplified.coordinates[0].reverse()
    }

    // Convert the simplified geometry back to an OpenLayers geometry
    simplifiedGeometry = new GeoJSON().readGeometry(simplified)

    // Get the number of points in the simplified geometry
    const newCoordinates = simplifiedGeometry.getFlatCoordinates()
    numPoints = newCoordinates.length / 2

    if (numPoints === previousNumPoints) {
      // If the number of points hasn't changed, break out of the loop
      break
    }

    previousNumPoints = numPoints
  }

  return simplifiedGeometry
}

/**
 * Draws the shapefile on the map
 * @param {Object} params
 * @param {Boolean} params.drawingNewLayer - If a new layer is being drawn
 * @param {Array} params.selectedFeatures - The currently selected features
 * @param {Object} params.shapefile - The shapefile to draw
 * @param {Function} params.onChangeQuery - Callback to update the query
 * @param {Function} params.onChangeProjection - Callback to update the map projection
 * @param {Function} params.onMetricsMap - Callback to send metrics events
 * @param {Function} params.onToggleTooManyPointsModal - Callback to toggle the too many points modal
 * @param {Function} params.onUpdateShapefile - Callback to update the shapefile
 * @param {String} params.projectionCode - The current map projection
 * @param {Boolean} params.shapefileAdded - If the shapefile was just added
 * @param {Boolean} params.showMbr - If the spatial polygon warning should be displayed
 * @param {Object} params.vectorSource - The source to draw the shapefile on
 */
const drawShapefile = ({
  drawingNewLayer,
  selectedFeatures,
  shapefile,
  onChangeQuery,
  onChangeProjection,
  onMetricsMap,
  onToggleTooManyPointsModal,
  onUpdateShapefile,
  projectionCode,
  shapefileAdded,
  showMbr,
  vectorSource
}) => {
  vectorSource.clear()

  if (drawingNewLayer !== false) return

  // Create features from the GeoJSON file
  const features = new GeoJSON().readFeatures(shapefile)
  if (!features.length) return

  const numFeatures = features.length

  features.forEach((feature) => {
    feature.set('isShapefile', true)
    feature.set('selected', false)
    feature.set('projectionCode', projectionCodes.geographic)

    let geometry = feature.getGeometry()
    const geometryType = geometry.getType()
    const radius = feature.get('radius')

    // Simplify the shape if it has too many points
    geometry = simplifyShape({
      geometry,
      onToggleTooManyPointsModal,
      shapefileAdded
    })

    // Save the geographic coordinates of the feature to use for the spatial query
    feature.set('geographicCoordinates', geometry.getCoordinates(true))

    let geometryInProjection = geometry.clone()

    if (projectionCode !== projectionCodes.geographic) {
      geometryInProjection = geometryInProjection.transform(
        crsProjections[projectionCodes.geographic],
        crsProjections[projectionCode]
      )
    }

    feature.setGeometry(geometryInProjection)

    // If the feature is a point with a radius, create a circle from the point
    if (geometryType === spatialTypes.POINT && radius) {
      const circle = circular(geometryInProjection.getCoordinates(), radius, 64)

      // Save the circle geometry to use for the spatial query
      feature.set('circleGeometry', [geometry.getCoordinates(), radius])

      // Save the geometry type to use for the spatial query
      feature.set('geometryType', spatialTypes.CIRCLE)

      feature.setGeometry(circle)
    } else {
      // Save the geometry type to use for the spatial query
      feature.set('geometryType', geometryType)
    }

    // Set the style for the feature
    if (numFeatures > 1) {
      if (geometryType === spatialTypes.POINT && !radius) {
        feature.setStyle(unselectedShapefileMarkerStyle)
      } else {
        feature.setStyle(unselectedShapefileStyle)
      }
    }

    const edscId = feature.get('edscId')
    if (
      (selectedFeatures && selectedFeatures.includes(edscId))
      || (!selectedFeatures && numFeatures === 1)
    ) {
      // If there are selected features, and this feature is selected,
      // Of if there are no selected features, and there is only one feature,
      // Set the feature as selected
      feature.set('selected', true)

      // Set the style for the feature
      if (geometryType === spatialTypes.POINT && !radius) {
        feature.setStyle(spatialSearchMarkerStyle)
      } else {
        feature.setStyle(spatialSearchStyle)
      }
    }
  })

  // Add the features to the vector source
  vectorSource.addFeatures(features)

  // If there are no selected features and there is only one feature,
  // Update the spatial query and selectedFeatures
  if (!selectedFeatures && numFeatures === 1) {
    const feature = features[0]

    // Add the feature's geometry as the spatial query
    onChangeQuery({
      collection: {
        spatial: getQueryFromShapefileFeature(feature)
      }
    })

    // Set the selectedFeatures in the shapefile
    const edscId = feature.get('edscId')
    onUpdateShapefile({ selectedFeatures: [edscId] })
  }

  // If the map should be moved and onChangeProjection is defined, determine of we need to
  // change the map projection
  if (shapefileAdded && onChangeProjection) {
    // The vector source extent is the bounding box of all shapes
    const sourceExtent = vectorSource.getExtent()

    let geographicExtent = sourceExtent
    // If the current projection is not geographic, we need to transform the extent to geographic coordinates
    if (projectionCode !== projectionCodes.geographic) {
      const swPoint = transform(
        [sourceExtent[0], sourceExtent[1]],
        crsProjections[projectionCode],
        crsProjections[projectionCodes.geographic]
      )
      const nePoint = transform(
        [sourceExtent[2], sourceExtent[3]],
        crsProjections[projectionCode],
        crsProjections[projectionCodes.geographic]
      )

      geographicExtent = [swPoint[0], swPoint[1], nePoint[0], nePoint[1]]
    }

    // Get the latitudes of the extent
    const latitudes = geographicExtent.filter((value, index) => index % 2 === 1)

    // If all of the latitudes are outside of 66.5 and -66.5, all of the points are in the Arctic or Antarctic
    const allLatitudesInArctic = latitudes.every((latitude) => latitude > 66.5)
    const allLatitudesInAntarctic = latitudes.every((latitude) => latitude < -66.5)

    // Set the new projection if all of the latitudes are in the Arctic or Antarctic
    let newProjection
    if (allLatitudesInArctic) newProjection = projectionCodes.arctic
    if (allLatitudesInAntarctic) newProjection = projectionCodes.antarctic

    // If there is a new projection, update the map projection
    if (newProjection) {
      onChangeProjection(newProjection)
    }
  }

  // If the shapefile was just added, move the map to the shapefile
  if (shapefileAdded) {
    // Create the metrics event
    onMetricsMap('Added Shapefile')

    // SetTimeout is needed here because the map needs to be rendered before the map can be moved
    setTimeout(() => {
      eventEmitter.emit(mapEventTypes.MOVEMAP, {
        source: vectorSource
      })
    }, 0)
  }

  // If the spatial polygon warning is enabled, add an MBR around the shape
  if (showMbr) {
    // Loop through all the features in the vector source
    vectorSource.getFeatures().forEach((feature) => {
      // Get the extent of the feature (which is the MBR)
      const extent = feature.getGeometry().getExtent()

      // Create a polygon from the extent
      const polygon = new Polygon([
        [
          [extent[0], extent[1]],
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]]
        ]
      ])

      let polygonInProjection = polygon

      // If the projection is not geographic, transform the polygon to the current projection
      if (projectionCode !== projectionCodes.geographic) {
        polygonInProjection = polygon.transform(
          crsProjections[projectionCodes.geographic],
          crsProjections[projectionCode]
        )
      }

      // Create the feature and add it to the vector source
      const mbrFeature = new Feature({
        geometry: polygonInProjection
      })

      mbrFeature.setStyle(mbrStyle)

      vectorSource.addFeature(mbrFeature)
    })
  }
}

export default drawShapefile
