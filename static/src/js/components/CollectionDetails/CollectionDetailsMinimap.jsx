import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import { PropTypes } from 'prop-types'

import { getColorByIndex } from '../../util/colors'
import normalizeCollectionSpatial from '../../util/map/normalizeCollectionSpatial'
import { pointRadius } from '../../util/map/styles'
// Import CollectionDetailsFeatureGroup from './CollectionDetailsFeatureGroup'

// import crsProjections from '../../util/map/crs'

import './CollectionDetailsMinimap.scss'

import MapThumb from '../../../assets/images/plate_carree_earth_scaled@2x.png'

export const CollectionDetailsMinimap = ({ metadata }) => {
  // TODO how to get at this cleaner use index 0 make this color better?
  const canvasHighlightColor = getColorByIndex(0)
  const collectionGeoFeatures = normalizeCollectionSpatial(metadata)
  console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:21 ~ metadata:', metadata)
  const allShapes = {
    type: 'FeatureCollection',
    features: [
      collectionGeoFeatures
    ]
  }
  const drawFeatures = (ctx, features, options) => {
    console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:67 ~ features:', features)
    // TODO make sure that the
    ctx.strokeStyle = canvasHighlightColor
    ctx.fillStyle = 'limegreen'
    ctx.lineWidth = options.lineWidth || 5
    ctx.globalAlpha = options.alpha || 1

    features.forEach((feature) => {
      ctx.beginPath()
      // Const geometryType = feature.geometry.getType()
      const { geometry } = feature
      console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:42 ~ geometry:', geometry)
      // If (geometry.getType() === 'MultiPoint') {
      //   return
      // }

      geometry.coordinates[0].forEach(([lon, lat], index) => {
        const x = (lon + 180) * (800 / 360) // Convert longitude to x
        const y = (90 - lat) * (400 / 180) // Convert latitude to y
        // ctx.arc(pixel[0] * scale, pixel[1] * scale, pointRadius * scale, 0, 2 * Math.PI)
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })

      ctx.closePath()
      if (!options.stroke === false) ctx.stroke()
      if (!options.fill === false) ctx.fill()
    })
  }

  const canvasRef = useRef(null)
  const [collectionAllShapes] = useState(allShapes)
  const imgSrc = MapThumb

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    // TODO size this based on the window size
    const width = 360
    const height = 200
    console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:67 ~ height:', height)
    canvas.width = width
    canvas.height = height

    // Load the basemap image
    const img = new Image()
    img.src = imgSrc
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height) // Draw the world map as the base layer

      // drawFeatures(ctx, geojson.features, { fill: false }) // Draw GeoJSON on top of the image
      console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:101 ~ geojson.features,:', collectionAllShapes.features)

      drawFeatures(ctx, collectionAllShapes.features, {
        stroke: false,
        alpha: 0.15
      }) // Draw GeoJSON on top of the image

      const scale = 2
      // Draw GeoJSON on top of the image
      ctx.strokeStyle = canvasHighlightColor
      ctx.fillStyle = canvasHighlightColor
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.15
      collectionAllShapes.features.forEach((feature) => {
        console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:121 ~ feature:', feature)

        ctx.beginPath()
        feature.geometry.coordinates[0].forEach((coordinate, index) => {
          console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:105 ~ index:', index)
          const [lon, lat] = coordinate
          console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:106 ~ lon:', lon)
          const x = (lon + 180) * (width / 360) // Convert longitude to x
          console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:108 ~ x:', x)
          const y = (90 - lat) * (height / 180) // Convert latitude to y
          if (index === 0) {
            // Ctx.moveTo((x * scale) + (pointRadius * scale), y * scale)
            ctx.moveTo(x, y)
            // Ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
            // Ctx.arc(x * scale, y * scale, pointRadius * scale, 0, 2 * Math.PI)
          } else {
            ctx.lineTo(x, y)
            console.log('else is being called')
          }
        })

        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      })
    }
  }, [imgSrc, collectionAllShapes])

  return (
    <div className="collection-details-minimap">
      <canvas ref={canvasRef} className="minimap" />
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
