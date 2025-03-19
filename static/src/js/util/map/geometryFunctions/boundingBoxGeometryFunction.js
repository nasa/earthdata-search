import {
  GeometryCollection,
  Point,
  Polygon
} from 'ol/geom'

import { interpolateBoxPolygon, makeCounterClockwise } from '../normalizeGranuleSpatial'
import { crsProjections } from '../crs'
import projections from '../projections'

/**
 * OpenLayers GeometryFunction for drawing a bounding box
 * https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw.html#~GeometryFunction
 *
 * This function will draw a polygon representing a bounding box on the map. In the polar projections
 * the polygon will be interpolated to add points to ensure it is drawn correctly.
 */
const boundingBoxGeometryFunction = (coordinates, geometry, projection) => {
  // Create points for each coordinate, starting and ending
  const startingPoint = new Point(coordinates[0])
  const endingPoint = new Point(coordinates[1])

  // If no geometry is provided, create a new GeometryCollection
  let workingGeometry = geometry
  if (!workingGeometry) {
    workingGeometry = new GeometryCollection([
      // The polygon will be what is drawn on the map
      new Polygon([]),
      // The starting and ending points will be saved in the GeometryCollection
      // for use in the `drawend` event
      startingPoint.clone(),
      endingPoint.clone()
    ])
  }

  // Update the GeometryCollection with the new ending point
  const geometries = workingGeometry.getGeometries()
  geometries[2] = endingPoint.clone()

  // Create a polygon from the starting and ending points
  const startCoords = startingPoint.transform(
    projection,
    crsProjections[projections.geographic]
  ).getCoordinates()
  const endCoords = endingPoint.transform(
    projection,
    crsProjections[projections.geographic]
  ).getCoordinates()
  const polygonCoordinates = [
    startCoords,
    [endCoords[0], startCoords[1]],
    endCoords,
    [startCoords[0], endCoords[1]],
    startCoords
  ]

  // Ensure the polygon is drawn clockwise
  const clockwisePolygon = makeCounterClockwise(polygonCoordinates)

  // Interpolate the polygon to ensure it is drawn correctly
  const interpolatedPolygon = interpolateBoxPolygon(clockwisePolygon, 2, 6)

  // Transform the polygon to the projection of the map
  const polygonInProjection = new Polygon(interpolatedPolygon).transform(
    crsProjections[projections.geographic],
    projection
  )

  // Update the polygon in the GeometryCollection
  geometries[0] = polygonInProjection

  // Update the GeometryCollection with the new geometries
  workingGeometry.setGeometries(geometries)

  return workingGeometry
}

export default boundingBoxGeometryFunction
