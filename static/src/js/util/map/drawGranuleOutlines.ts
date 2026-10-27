import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import { Geometry } from 'ol/geom'

import drawOutline from './drawOutline'
import drawGpuGranuleOutlines, { hideGpuGranuleOutlines } from './gpuGranuleOutlines'

const drawGranuleOutlines = ({
  ctx,
  granuleBackgroundsSource,
  map,
  coordinateToPixelTransform
}: {
  /** The canvas context to draw on */
  ctx: CanvasRenderingContext2D
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** The map to draw on */
  map: Map
  /** The frame's coordinate-to-pixel transform, enables the GPU painter while the map moves */
  coordinateToPixelTransform?: number[]
}) => {
  if (!map) {
    ctx.reset()

    return
  }

  const view = map.getView()
  const isMoving = view.getAnimating() || view.getInteracting()

  // Accelerate interaction frames. Settled frames use Canvas for the exact final image.
  if (isMoving && coordinateToPixelTransform) {
    const renderedWithGpu = drawGpuGranuleOutlines({
      ctx,
      map,
      granuleBackgroundsSource,
      matrix: coordinateToPixelTransform
    })

    if (renderedWithGpu) return
  }

  hideGpuGranuleOutlines(map)
  ctx.reset()

  const pixelRatio = window.devicePixelRatio || 1
  const viewExtent = view.calculateExtent(map.getSize())
  const visibleFeatures = granuleBackgroundsSource.getFeaturesInExtent(viewExtent)
    .sort((a, b) => a.get('index') - b.get('index'))

  visibleFeatures.forEach((feature) => {
    ctx.beginPath()

    // Later granules sit behind earlier ones, preserving the feature stack.
    ctx.globalCompositeOperation = 'destination-over'

    const granuleStyle = feature.get('granuleStyle')
    if (!granuleStyle) return

    const stroke = granuleStyle.getStroke()

    // Point granules carry their stroke on the image style.
    if (!stroke) {
      const image = granuleStyle.getImage()
      ctx.strokeStyle = image.getStroke().getColor()
      ctx.lineWidth = image.getStroke().getWidth()
    } else {
      ctx.strokeStyle = stroke.getColor()
      ctx.lineWidth = stroke.getWidth()
    }

    drawOutline({
      ctx,
      geometry: feature.getGeometry() as Geometry,
      map,
      scale: pixelRatio
    })

    ctx.stroke()

    // The outer rectangle makes this an inverse clip: later granules cannot
    // draw inside this granule. Each clip accumulates until the next reset.
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.clip()
  })

  ctx.globalCompositeOperation = 'source-over'
}

export default drawGranuleOutlines
