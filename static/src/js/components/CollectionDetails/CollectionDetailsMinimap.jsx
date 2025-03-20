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

import MapThumb from '../../../assets/images/plate_carree_earth_scaled@2x.png'

export const CollectionDetailsMinimap = ({ metadata }) => {
  const canvasHighlightColor = getColorByIndex(0)
  const collectionGeoFeatures = normalizeSpatial(metadata)
  console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:23 ~ collectionGeoFeatures:', collectionGeoFeatures)
  console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:21 ~ metadata:', metadata)
  const allShapes = {
    type: 'FeatureCollection',
    features: [
      collectionGeoFeatures
    ]
  }

  const drawFeatures = (ctx, allFeatures, options) => {
    allFeatures.features.forEach((feature) => {
      console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:121 ~ feature:', feature)

      ctx.beginPath()
      const geoJsonFeatureType = feature.geometry.type

      console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:110 ~ geoJsonFeatureType:', geoJsonFeatureType)
      feature.geometry.coordinates.forEach((coordinate) => {
        console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:143 ~ coordinate:', coordinate)
        // Draw points
        if (geoJsonFeatureType === 'MultiPoint') {
          const [lng, lat] = coordinate
          const x = (lng + 180) * (options.width / 360) // Convert longitude to x
          const y = (90 - lat) * (options.height / 180) // Convert latitude to y

          ctx.arc(x, y, pointRadius * options.scale, 0, 2 * Math.PI)
          ctx.closePath()
          ctx.stroke()
          ctx.fill()

          return
        }

        coordinate.forEach((points, pointsIndex) => {
          console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:115 ~ points:', points)
          if (geoJsonFeatureType === 'MultiLineString') {
            const [lng, lat] = points
            console.log('🚀 ~ file: foo.jsx:124 ~ lat:', lat)
            console.log('🚀 ~ file: foo.jsx:124 ~ lng:', lng)
            const x = (lng + 180) * (options.width / 360) // Convert longitude to x
            const y = (90 - lat) * (options.height / 180) // Convert latitude to y

            if (pointsIndex === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          } else {
            // The shape is a polygon (bounding boxes are converted to polygons)
            points.forEach(([lng, lat], index) => {
              console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:115 ~ lng:', lng)
              console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:115 ~ lat:', lat)
              const x = (lng + 180) * (options.width / 360) // Convert longitude to x
              console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:108 ~ x:', x)
              const y = (90 - lat) * (options.height / 180) // Convert latitude to y

              // If it is the first point move the canvas to start drawing over the map
              if (index === 0) {
                if (geoJsonFeatureType === 'MultiPoint') {
                  ctx.moveTo(x, y)
                  ctx.arc(x, y, pointRadius * options.scale, 0, 2 * Math.PI)
                  // Ctx.moveTo((x * scale) + (pointRadius * scale), y * scale)

                // ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
                } else {
                  ctx.moveTo(x, y)
                  console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:127 ~ y:', y)
                  console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:127 ~ x:', x)
                }
              // Ctx.arc(x * scale, y * scale, pointRadius * scale, 0, 2 * Math.PI)
              } else {
                ctx.lineTo(x, y)
                console.log('else is being called')
              }
            })
          }
        })

        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      })
    })
  }

  const canvasRef = useRef(null)
  const [collectionAllShapes] = useState(allShapes)
  console.log('🚀 ~ file: CollectionDetailsMinimap.jsx:63 ~ collectionAllShapes:', collectionAllShapes)
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
