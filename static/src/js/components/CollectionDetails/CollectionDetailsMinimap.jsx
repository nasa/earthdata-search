import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import { PropTypes } from 'prop-types'

import { getColorByIndex } from '../../util/colors'
import normalizeSpatial from '../../util/map/normalizeSpatial'
import { pointRadius } from '../../util/map/styles'

import './CollectionDetailsMinimap.scss'

export const CollectionDetailsMinimap = ({ metadata }) => {
  const collectionGeoFeatures = []

  const getCollectionGeoFeatures = (collectionMetadata) => {
    const {
      boxes,
      lines,
      points,
      polygons
    } = collectionMetadata
    console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:26 ~ lines:', lines)

    if (boxes) {
      const boxFeatures = normalizeSpatial({ boxes })
      collectionGeoFeatures.push(boxFeatures)
    }

    if (lines) {
      const linesFeatures = normalizeSpatial({ lines })
      collectionGeoFeatures.push(linesFeatures)
    }

    if (points) {
      const pointsFeatures = normalizeSpatial({ points })
      collectionGeoFeatures.push(pointsFeatures)
    }

    if (polygons) {
      const polygonsFeatures = normalizeSpatial({ polygons })
      collectionGeoFeatures.push(polygonsFeatures)
    }
  }

  const canvasHighlightColor = getColorByIndex(0)
  // TODO for each spatial object normalize it and draw it
  // const collectionGeoFeatures = normalizeSpatial(metadata)
  // Populate all shapes
  getCollectionGeoFeatures(metadata)
  const allShapes = {
    type: 'FeatureCollection',
    features: collectionGeoFeatures
  }

  const drawMultiPolygonFeature = (ctx, feature, options) => {
    // The shape is a polygon (bounding boxes are converted to polygons)
    feature.geometry.coordinates.forEach((coordinate) => {
      coordinate.forEach((points) => {
        points.forEach(([lng, lat], index) => {
          const x = (lng + 180) * (options.width / 360) // Convert longitude to x
          const y = (90 - lat) * (options.height / 180) // Convert latitude to y

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

  const drawMultiPointFeature = (ctx, feature, options) => {
    feature.geometry.coordinates.forEach(([lng, lat]) => {
      const x = (lng + 180) * (options.width / 360) // Convert longitude to x
      const y = (90 - lat) * (options.height / 180) // Convert latitude to y

      ctx.arc(x, y, pointRadius * options.scale, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.stroke()
      ctx.fill()
    })
  }

  // TODO try to combine this and polygons
  const drawMultiLineFeature = (ctx, feature, options) => {
    feature.geometry.coordinates.forEach((coordinate) => {
      coordinate.forEach(([lng, lat], index) => {
        const x = (lng + 180) * (options.width / 360) // Convert longitude to x
        const y = (90 - lat) * (options.height / 180) // Convert latitude to y

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

  const drawFeatures = (ctx, allFeatures, options) => {
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

  const canvasRef = useRef(null)
  const [collectionAllShapes] = useState(allShapes)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    // TODO size this based on the window size
    const width = 360
    const height = 180
    console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:67 ~ height:', height)
    canvas.width = width
    canvas.height = height

    // Load the basemap image

    // ctx.drawImage(img, 0, 0, width, height) // Draw the world map as the base layer

    // Draw GeoJSON on top of the image
    ctx.strokeStyle = canvasHighlightColor
    ctx.fillStyle = canvasHighlightColor
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.6

    drawFeatures(ctx, collectionAllShapes, {
      fill: false,
      scale: 2,
      width,
      height
    }) // Draw GeoJSON on top of the image
  })

  return (
    <div className="collection-details-minimap">
      <canvas ref={canvasRef} className="collection-details-minimap__minimap" data-testid="collection-details-minimap" />
    </div>
  )
}

// <MapContainer
//   className="collection-details-minimap"
//   minZoom={0}
//   maxZoom={0}
//   zoom={0}
//   center={[0, 0]}
//   crs={crsProjections.simpleScaled(1)}
//   zoomControl={false}
//   attributionControl={false}
//   dragging={false}
//   touchZoom={false}
//   doubleClickZoom={false}
//   scrollWheelZoom={false}
//   tap={false}
// >
//   <ImageOverlay
//     url={MapThumb}
//     bounds={[[-90, -180], [90, 180]]}
//   />
//   <CollectionDetailsFeatureGroup metadata={metadata} />
// </MapContainer>

CollectionDetailsMinimap.propTypes = {
  metadata: PropTypes.shape({}).isRequired
}

export default CollectionDetailsMinimap
