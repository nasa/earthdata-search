import {
  GeometryCollection,
  Point,
  Polygon
} from 'ol/geom'
import { transform } from 'ol/proj'
import { getDistance } from 'ol/sphere'
import { circular } from 'ol/geom/Polygon'

import { crsProjections } from '../crs'
import projectionCodes from '../../../constants/projectionCodes'

/**
 * OpenLayers GeometryFunction for drawing a circle
 * https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw.html#~GeometryFunction
 *
 * This draws a Tissot Indicatrix circle on the map in the geographic projection
 * https://en.wikipedia.org/wiki/Tissot's_indicatrix
 * https://openlayers.org/en/latest/examples/tissot.html
 */
const circleGeometryFunction = (coordinates, geometry, projection) => {
  // If no geometry is provided, create a new GeometryCollection
  let workingGeometry = geometry
  if (!workingGeometry) {
    workingGeometry = new GeometryCollection([
      // The polygon will be what is drawn on the map
      new Polygon([]),
      // The center point will be saved in the GeometryCollection
      // for use in the `drawend` event
      new Point(coordinates[0])
    ])
  }

  const geometries = workingGeometry.getGeometries()

  // Transform the coordinates to the geographic projection
  const circleCenter = transform(
    coordinates[0],
    projection,
    crsProjections[projectionCodes.geographic]
  )
  const circleLast = transform(
    coordinates[1],
    projection,
    crsProjections[projectionCodes.geographic]
  )

  // Calculate the radius of the circle
  const radius = getDistance(circleCenter, circleLast)

  // Create a circular polygon
  const circle = circular(circleCenter, radius, 64)

  // Update the GeometryCollection with the new circle
  geometries[0] = circle

  // Update the GeometryCollection with the new geometries
  workingGeometry.setGeometries(geometries)

  return workingGeometry
}

export default circleGeometryFunction
