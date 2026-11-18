import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'

import drawOutline from './drawOutline'
import { drawGranuleOutlinesSnapshot, saveGranuleOutlinesSnapshot } from './granuleOutlinesSnapshot'

import spatialTypes from '../../constants/spatialTypes'

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

  const view = map.getView()
  const isMoving = view.getAnimating() || view.getInteracting()

  // Drawing the outlines of a lot of granules is slow. If the outlines that were drawn last
  // time can be used again, draw the copy of them that was saved instead.
  const snapshotDrawn = drawGranuleOutlinesSnapshot({
    ctx,
    granuleBackgroundsSource,
    isMoving,
    map
  })

  if (snapshotDrawn) return

  // Get the device pixel ratio for use in scaling the drawing
  const dpr = window.devicePixelRatio || 1

  const viewExtent = view.calculateExtent(map.getSize())

  // Only get the features that intersect the view extent
  const features = granuleBackgroundsSource.getFeaturesInExtent(viewExtent)

  // The granules are drawn as a 'stack'. The granule with the lowest index is on the top of
  // the stack, and each granule hides the outlines of the granules below it.
  //
  // To draw the stack we start with the granule on the bottom and work up to the top. So
  // sort the features by the index property, highest index first.
  const sortedFeatures = features.sort((a, b) => b.get('index') - a.get('index'))

  // Loop through the features that have been drawn on the granuleBackgroundsLayer
  sortedFeatures.forEach((feature) => {
    ctx.beginPath()

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

    const geometry = feature.getGeometry() as Geometry

    // Draw the path for the granule outline
    drawOutline({
      ctx,
      geometry,
      map,
      scale: dpr
    })

    // If the granule is a polygon, erase the outlines of the granules below it from inside
    // the polygon. Filling with 'destination-out' doesn't paint anything, it removes what has
    // already been drawn from the area being filled.
    if (geometry.getType() === spatialTypes.MULTI_POLYGON) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fill()
    }

    // Set the globalCompositeOperation back to the default of 'source-over', so this
    // granule's outline is drawn on top of the outlines of the granules below it
    ctx.globalCompositeOperation = 'source-over'

    // Draw the shape on the canvas
    ctx.stroke()
  })

  // Save a copy of the outlines that were just drawn, so they can be used again
  saveGranuleOutlinesSnapshot({
    ctx,
    granuleBackgroundsSource,
    map
  })
}

export default drawGranuleOutlines
