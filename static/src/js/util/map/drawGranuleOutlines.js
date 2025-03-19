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
  if (geometryType === 'MultiPoint') {
    const points = geometry.getCoordinates()
    points.forEach((point) => {
      const [lng, lat] = point
      // Get the pixel location of the lat/lng
      const pixel = map.getPixelFromCoordinate([lng, lat])

      // Console.log('🚀 ~ file: drawGranuleOutlines.js:64 ~ scale:', scale)
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

  // Console.lohttp://localhost:8080/search/granules/collection-details?p=C1000000726-LARC_ASDC&pg[0][v]=f&q=C1000000726-LARC_ASDC&lat=-19.741068752501544&long=40.57383225114407&zoom=4.648478154374365g('🚀 ~ file: drawGranuleOutlines.js:82 ~ allShapes:', allShapes)
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
const drawGranuleOutlines = ({
  ctx,
  granuleBackgroundsSource,
  map
}) => {
  // Remove existing drawings on the canvas
  ctx.reset()

  // Get the device pixel ratio for use in scaling the drawing
  const dpr = window.devicePixelRatio || 1

  const viewExtent = map.getView().calculateExtent(map.getSize())

  // Only get the features that intersect the view extent
  const features = granuleBackgroundsSource.getFeaturesInExtent(viewExtent)

  // Sort features by the index property
  const sortedFeatures = features.sort((a, b) => a.get('index') - b.get('index'))

  // Loop through the features that have been drawn on the granuleBackgroundsLayer
  sortedFeatures.forEach((feature) => {
    ctx.beginPath()

    // Set the globalCompositeOperation to 'destination-over' so new granule outlines
    // are drawn behind existing granule backgrounds. This creates a 'stack' of granules.
    ctx.globalCompositeOperation = 'destination-over'

    // Get the style value saved in the feature's properties
    const properties = feature.getProperties()
    const { granuleStyle } = properties

    // If the feature has no style, return
    if (!granuleStyle) return

    const stroke = granuleStyle.getStroke()

    // If the style has no stroke, use the stroke from the image
    // This happens for granules with point spatial
    if (!stroke) {
      const image = granuleStyle.getImage()
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

    // Add path around full canvas extent to clip the granule outlines
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Clip
    ctx.clip()
  })

  // Reset the globalCompositeOperation to the default of 'source-over'
  ctx.globalCompositeOperation = 'source-over'
}

export default drawGranuleOutlines
