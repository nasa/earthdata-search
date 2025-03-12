import projections from './projections'
import { pointRadius } from './styles'

// Draw a boundary around the full extent for the projection. This allows
// us to clip the granule outlines to the projection boundary, which is what
// allows the outlines to 'stack' on top of each other.
export const drawBoundary = ({
  ctx,
  map,
  projectionCode,
  scale
}) => {
  let nw
  let ne
  let se
  let sw

  // Get the pixel locations of the corners of the projection
  if (projectionCode === projections.geographic) {
    nw = map.getPixelFromCoordinate([-190, 100])
    ne = map.getPixelFromCoordinate([190, 100])
    se = map.getPixelFromCoordinate([190, -100])
    sw = map.getPixelFromCoordinate([-190, -100])
  } else if (projectionCode === projections.arctic || projectionCode === projections.antarctic) {
    const polarBounds = 3314693.24

    nw = map.getPixelFromCoordinate([-polarBounds, polarBounds])
    ne = map.getPixelFromCoordinate([polarBounds, polarBounds])
    se = map.getPixelFromCoordinate([polarBounds, -polarBounds])
    sw = map.getPixelFromCoordinate([-polarBounds, -polarBounds])
  }

  // Draw the boundary on the canvas
  ctx.moveTo(nw[0] * scale, nw[1] * scale)
  ctx.lineTo(ne[0] * scale, ne[1] * scale)
  ctx.lineTo(se[0] * scale, se[1] * scale)
  ctx.lineTo(sw[0] * scale, sw[1] * scale)
  ctx.lineTo(nw[0] * scale, nw[1] * scale)
  ctx.closePath()

  // We don't call ctx.stroke() because we don't want to actually draw the boundary
  // We just want to use it as a clipping path
}

// Draw the granule outlines
export const drawOutline = ({
  ctx,
  geometry,
  map,
  scale
}) => {
  const geometryType = geometry.getType()

  // If the geometry is a point, draw a small circle around the point
  if (geometryType === 'MultiPoint') {
    const points = geometry.getCoordinates()
    points.forEach((point) => {
      const [lng, lat] = point
      // Get the pixel location of the lat/lng
      const pixel = map.getPixelFromCoordinate([lng, lat])

      // Draw the circle around the point
      ctx.moveTo((pixel[0] * scale) + (pointRadius * scale), pixel[1] * scale)
      ctx.arc(pixel[0] * scale, pixel[1] * scale, pointRadius * scale, 0, 2 * Math.PI)
      ctx.closePath()

      // Draw the shape on the canvas
      ctx.stroke()
    })

    return
  }

  // Get the coordinates of the shape
  let allShapes
  if (geometryType === 'MultiLineString') {
    const coordinates = geometry.getCoordinates()
    allShapes = [coordinates]
  } else if (geometryType === 'MultiPolygon') {
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
      if (geometryType === 'MultiPolygon') ctx.closePath()
    })
  })

  // Draw the shape on the canvas
  ctx.stroke()
}

// Draw the granule outlines
export const drawGranuleOutlines = ({
  ctx,
  granuleBackgroundsSource,
  map,
  projectionCode
}) => {
  // Remove existing drawings on the canvas
  ctx.reset()

  // Get the device pixel ratio for use in scaling the drawing
  const dpr = window.devicePixelRatio || 1

  // Loop through the features that have been drawn on the granuleBackgroundsLayer
  granuleBackgroundsSource.forEachFeature((feature) => {
    ctx.beginPath()

    // Set the globalCompositeOperation to 'destination-over' so new granule outlines
    // are drawn behind existing granule backgrounds. This creates a 'stack' of granules.
    ctx.globalCompositeOperation = 'destination-over'

    // Get the style value saved in the feature's properties
    const properties = feature.getProperties()
    const { style } = properties

    // If the feature has no style, return
    if (!style) return

    const stroke = style.getStroke()

    // If the style has no stroke, use the stroke from the image
    // This happens for granules with point spatial
    if (!stroke) {
      const image = style.getImage()
      ctx.strokeStyle = image.getStroke().getColor()
      ctx.lineWidth = image.getStroke().getWidth()
    } else {
      ctx.strokeStyle = stroke.getColor()
      ctx.lineWidth = stroke.getWidth()
    }

    // Draw the path for the granule outline
    drawOutline({
      ctx,
      geometry: feature.getGeometry(),
      map,
      scale: dpr
    })

    // Add path around full earth
    drawBoundary({
      ctx,
      map,
      projectionCode,
      scale: dpr
    })

    // Clip
    ctx.clip()
  })

  // Reset the globalCompositeOperation to the default of 'source-over'
  ctx.globalCompositeOperation = 'source-over'

  // Restore the context
  ctx.restore()
}
