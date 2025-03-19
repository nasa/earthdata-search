import { centroid as turfCentroid } from '@turf/turf'
import { pointRadius } from './styles'
import { getPolygonArea } from './normalizeSpatial'

/**
 * Converts square meters to square kilometers
 * @param {number} squareMeters - The area in square meters
 * @returns {number} The area in square kilometers
 */
const squareMetersToKilometers = (squareMeters) => squareMeters / 1000000

// Convert lat/lng to canvas points
const getCanvasPointsFromLatLong = ([lat, lng], options) => {
  const x = (lng + 180) * (options.canvasWidth / 360) // Convert longitude to x
  const y = (90 - lat) * (options.canvasHeight / 180) // Convert latitude to y

  return {
    x,
    y
  }
}

// Draw point features on the canvas
export const drawMultiPointFeature = (ctx, feature, options) => {
  feature.geometry.coordinates.forEach(([lng, lat]) => {
    const { x, y } = getCanvasPointsFromLatLong([lat, lng], options)
    ctx.arc(x, y, pointRadius * options.scale, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  })
}

// Draw polygon features on the canvas; if the polygon is too small it will draw as a point
export const drawMultiPolygonFeature = (ctx, feature, options) => {
  const polygonArea = squareMetersToKilometers(getPolygonArea(feature))
  // If a polygon is too small it won't draw well on a global map
  // less than 1000 square kilometers
  if (polygonArea < 1000) {
    const centroidFeature = turfCentroid(feature)
    // Get the centroid of the polygon convert to a multi-point and draw
    const multiPointCentroidFeature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPoint',
        coordinates: [centroidFeature.geometry.coordinates]
      }
    }

    drawMultiPointFeature(ctx, multiPointCentroidFeature, options)

    return
  }

  feature.geometry.coordinates.forEach((coordinate) => {
    coordinate.forEach((points) => {
      points.forEach(([lng, lat], index) => {
        const { x, y } = getCanvasPointsFromLatLong([lat, lng], options)

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

// Draw line features on the canvas
export const drawMultiLineFeature = (ctx, feature, options) => {
  feature.geometry.coordinates.forEach((coordinate) => {
    coordinate.forEach(([lng, lat], index) => {
      const { x, y } = getCanvasPointsFromLatLong([lat, lng], options)

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

// Pass feature to draw functions for the canvas
export const drawFeatures = (ctx, allFeatures, options) => {
  allFeatures.features.forEach((feature) => {
    if (!feature.geometry) return

    const geoJsonFeatureType = feature.geometry.type

    ctx.beginPath()
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
