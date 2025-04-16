import { getDistance } from 'ol/sphere'

import spatialTypes from '../../../constants/spatialTypes'
import { mapEventTypes } from '../../../constants/eventTypes'

import { crsProjections } from '../crs'
import projectionCodes from '../../../constants/projectionCodes'

import { eventEmitter } from '../../../events/events'

/**
 * Handles the Draw interaction `drawend` event. Takes the coordinates of the drawn geometry,
 * transforms them to geographic coordinates, and updates the redux state with the new spatial query.
 *
 * @param {Object} params
 * @param {Object} params.drawingInteraction OpenLayers drawing interaction
 * @param {Object} params.map OpenLayers map object
 * @param {Function} params.onChangeQuery Callback to update the redux state with the new query
 * @param {Function} params.onToggleDrawingNewLayer Callback to toggle the drawing new layer
 * @param {String} params.projectionCode The current projection code
 * @param {String} params.spatialType The current spatial type
 * @param {Object} event OpenLayers `drawend` event object
 */
const handleDrawEnd = (params, event) => {
  eventEmitter.emit(mapEventTypes.DRAWEND)

  const {
    drawingInteraction,
    map,
    onChangeQuery,
    onClearShapefile,
    onDrawEnd,
    onToggleDrawingNewLayer,
    projectionCode,
    spatialType
  } = params

  // Clear any shapefile from the map and store
  onClearShapefile()

  // Remove the drawing interaction, which stops the drawing
  map.removeInteraction(drawingInteraction)
  drawingInteraction.dispose()

  // Stop drawing the new layer
  onToggleDrawingNewLayer(false)

  // Get the geometry of the drawn feature
  const geometry = event.feature.getGeometry()

  let flatCoordinates

  if (spatialType === spatialTypes.BOUNDING_BOX) {
    // For a bounding box, the first geometry is the polygon drawn on the map
    // The second geometry is the starting point, and the third geometry is the ending point
    // We only need the starting and ending points to get the bounding box coordinates
    const geometries = geometry.getGeometries()
    const start = geometries[1].transform(
      crsProjections[projectionCode],
      crsProjections[projectionCodes.geographic]
    ).getCoordinates()
    const end = geometries[2].transform(
      crsProjections[projectionCode],
      crsProjections[projectionCodes.geographic]
    ).getCoordinates()

    // Get the southwest and northeast coordinates of the bounding box
    const swLon = Math.min(start[0], end[0])
    const swLat = Math.min(start[1], end[1])
    const neLon = Math.max(start[0], end[0])
    const neLat = Math.max(start[1], end[1])

    // Flatten the bounding box coordinates so CMR can understand them
    flatCoordinates = [
      swLon,
      swLat,
      neLon,
      neLat
    ]
  }

  if (spatialType === spatialTypes.CIRCLE) {
    // For a circle we need to look at the polygon and get the center point and the last coordinate
    // The center point is the point in the middle of the circle.
    // The last coordinate is the point on the circle that was clicked to finish drawing.
    // We can use these two points to calculate the radius of the circle.

    // Transform the geometry to geographic coordinates
    const geographicCoordinates = geometry.transform(
      crsProjections[projectionCode],
      crsProjections[projectionCodes.geographic]
    )

    if (projectionCode === projectionCodes.geographic) {
      // If the map is in the geographic projection, the geometry will be a GeometryCollection
      // The first geometry is the polygon representing the circle, and the second geometry is the center point
      const [polygon, point] = geographicCoordinates.getGeometries()

      const circleCenter = point.getCoordinates()
      const lastCoord = polygon.getLastCoordinate()

      // Calculate the radius of the circle
      const radiusInMeters = getDistance(circleCenter, lastCoord)

      // Flatten the circle coordinates so CMR can understand them
      flatCoordinates = [
        circleCenter[0],
        circleCenter[1],
        Math.round(radiusInMeters)
      ]
    } else {
      // If the map is in a polar projection, the geometry will be a Polygon
      // The center point is the center of the circle, and the last coordinate is the point on the circle
      // that was clicked to finish drawing
      const circleCenter = geographicCoordinates.getCenter()
      const lastCoord = geographicCoordinates.getLastCoordinate()

      // Calculate the radius of the circle
      const radiusInMeters = getDistance(circleCenter, lastCoord)

      // Flatten the circle coordinates so CMR can understand them
      flatCoordinates = [
        circleCenter[0],
        circleCenter[1],
        Math.round(radiusInMeters)
      ]
    }
  }

  if (spatialType === spatialTypes.POINT) {
    // For a point, we can just flatten the geographic coordinates
    const geographicCoordinates = geometry.transform(
      crsProjections[projectionCode],
      crsProjections[projectionCodes.geographic]
    )

    // Flatten the point coordinates so CMR can understand them
    flatCoordinates = geographicCoordinates.getFlatCoordinates()
  }

  if (spatialType === spatialTypes.POLYGON) {
    // For a polygon, we need to get the coordinates of the polygon in counter-clockwise order
    const geographicCoordinates = geometry.transform(
      crsProjections[projectionCode],
      crsProjections[projectionCodes.geographic]
    )

    // Get the coordinates of the polygon in counter-clockwise order
    const counterClockWiseCoordinates = geographicCoordinates.getCoordinates(true)

    // Flatten the counterClockWiseCoordinates
    flatCoordinates = counterClockWiseCoordinates[0].flat()
  }

  // Trim the coordinates to 5 decimal places
  const pow = 10 ** 5
  const truncatedCoordinates = flatCoordinates.map(
    (coordinate) => Math.round(coordinate * pow) / pow
  )

  // Determine the query type (for Redux) based on the spatial type
  const queryType = spatialType === spatialTypes.BOUNDING_BOX ? 'boundingBox' : spatialType.toLowerCase()

  // Update the redux state with the new spatial query
  onChangeQuery({
    collection: {
      spatial: {
        [queryType]: [truncatedCoordinates.join(',')]
      }
    }
  })

  // Call any onDrawEnd callback passed to the function
  if (onDrawEnd) onDrawEnd(geometry)
}

export default handleDrawEnd
