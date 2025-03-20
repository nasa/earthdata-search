import { pointRadius } from './styles'

export const drawMultiPolygonFeature = (ctx, feature, options) => {
  // The shape is a polygon (bounding boxes are converted to polygons)
  feature.geometry.coordinates.forEach((coordinate) => {
    coordinate.forEach((points) => {
      points.forEach(([lng, lat], index) => {
        const x = (lng + 180) * (options.canvasWidth / 360) // Convert longitude to x
        const y = (90 - lat) * (options.canvasHeight / 180) // Convert latitude to y

        // If it is the first point move the canvas to start drawing over the map
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
    })

    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  })
}

export const drawMultiPointFeature = (ctx, feature, options) => {
  feature.geometry.coordinates.forEach(([lng, lat]) => {
    const x = (lng + 180) * (options.canvasWidth / 360) // Convert longitude to x
    const y = (90 - lat) * (options.canvasHeight / 180) // Convert latitude to y

    ctx.arc(x, y, pointRadius * options.scale, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  })
}

// TODO try to combine this and polygons
export const drawMultiLineFeature = (ctx, feature, options) => {
  feature.geometry.coordinates.forEach((coordinate) => {
    coordinate.forEach(([lng, lat], index) => {
      const x = (lng + 180) * (options.canvasWidth / 360) // Convert longitude to x
      const y = (90 - lat) * (options.canvasHeight / 180) // Convert latitude to y

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
  })

  ctx.closePath()
  ctx.stroke()
  ctx.fill()
}

export const drawFeatures = (ctx, allFeatures, options) => {
  allFeatures.features.forEach((feature) => {
    const geoJsonFeatureType = feature.geometry.type
    console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:85 ~ geoJsonFeatureType:', geoJsonFeatureType)

    ctx.beginPath()
    // TODO draw a marker when the polygon is small
    if (geoJsonFeatureType === 'MultiPolygon') {
      drawMultiPolygonFeature(ctx, feature, options)
    }

    if (geoJsonFeatureType === 'MultiPoint') {
      drawMultiPointFeature(ctx, feature, options)
    }

    if (geoJsonFeatureType === 'MultiLineString') {
      drawMultiLineFeature(ctx, feature, options)
    }
  })

  return null
}
