import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'

import drawOutline from './drawOutline'

// Draw the granule outlines
const drawGranuleOutlines = ({
  ctx,
  granuleBackgroundsSource,
  map
}: {
  /** The canvas context to draw on */
  ctx: CanvasRenderingContext2D
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** The map to draw on */
  map: Map
}) => {
  // Remove existing drawings on the canvas
  ctx.reset()

  // If the map is undefined, don't draw anything
  if (!map) return

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
      geometry: feature.getGeometry() as Geometry,
      map,
      scale: dpr
    })

    // Draw the shape on the canvas
    ctx.stroke()

    // Add path around full canvas extent to clip the granule outlines
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Clip
    ctx.clip()
  })

  // Reset the globalCompositeOperation to the default of 'source-over'
  ctx.globalCompositeOperation = 'source-over'
}

export default drawGranuleOutlines
