import spatialTypes from '../../constants/spatialTypes'
import { pointRadius } from './styles'

// Draw the granule outlines
const drawOutline = ({
  ctx,
  geometry,
  map,
  scale
}) => {
  const geometryType = geometry.getType()

  // If the geometry is a point, draw a small circle around the point
  if (geometryType === spatialTypes.MULTI_POINT) {
    const points = geometry.getCoordinates()
    points.forEach((point) => {
      const [lng, lat] = point
      // Get the pixel location of the lat/lng
      const pixel = map.getPixelFromCoordinate([lng, lat])

      // Draw the circle around the point
      ctx.moveTo((pixel[0] * scale) + (pointRadius * scale), pixel[1] * scale)
      ctx.arc(pixel[0] * scale, pixel[1] * scale, pointRadius * scale, 0, 2 * Math.PI)
      ctx.closePath()
    })

    return
  }

  // Get the coordinates of the shape
  let allShapes
  if (geometryType === spatialTypes.MULTI_LINE_STRING) {
    const coordinates = geometry.getCoordinates()
    allShapes = [coordinates]
  } else if (geometryType === spatialTypes.MULTI_POLYGON) {
    allShapes = geometry.getCoordinates()
  }

  allShapes.forEach((shape) => {
    shape.forEach((coordinate) => {
      coordinate.forEach(([lng, lat], index) => {
        // Get the pixel location of the lat/lng
        const pixel = map.getPixelFromCoordinate([lng, lat])

        if (index === 0) {
          // If it is the first point in the shape, move to that point
          ctx.moveTo(pixel[0] * scale, pixel[1] * scale)
        }

        // Draw a line to the point in the shape
        ctx.lineTo(pixel[0] * scale, pixel[1] * scale)
      })

      // Close the path if it is a polygon
      if (geometryType === spatialTypes.MULTI_POLYGON) ctx.closePath()
    })
  })
}

export default drawOutline
