import React, {
  useRef,
  useEffect,
  useState
} from 'react'
import { PropTypes } from 'prop-types'

import { getColorByIndex } from '../../util/colors'
import normalizeSpatial from '../../util/map/normalizeSpatial'
import { drawFeatures } from '../../util/map/drawCollectionMinimap'

import './CollectionDetailsMinimap.scss'

export const CollectionDetailsMinimap = ({ metadata }) => {
  const collectionGeoFeatures = []
  const canvasWidth = 360
  const canvasHeight = 180

  // Ctx properties
  const ctxHighlightColor = getColorByIndex(0)
  const ctxLineWidth = 2
  const ctxGlobalAlpha = 0.6

  const getCollectionGeoFeatures = (collectionMetadata) => {
    const {
      boxes,
      lines,
      points,
      polygons
    } = collectionMetadata

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

  // Populate all shapes
  getCollectionGeoFeatures(metadata)
  const allShapes = {
    type: 'FeatureCollection',
    features: collectionGeoFeatures
  }

  const canvasRef = useRef(null)
  const [collectionAllShapes] = useState(allShapes)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Set ctx properties
    ctx.strokeStyle = ctxHighlightColor
    ctx.fillStyle = ctxHighlightColor
    ctx.lineWidth = ctxLineWidth
    ctx.globalAlpha = ctxGlobalAlpha

    drawFeatures(ctx, collectionAllShapes, {
      fill: false,
      scale: 2,
      canvasWidth,
      canvasHeight
    }) // Draw GeoJSON on top of the base map image
  })

  return (
    <div className="collection-details-minimap">
      <canvas ref={canvasRef} className="collection-details-minimap__minimap" data-testid="collection-details-minimap" />
    </div>
  )
}

CollectionDetailsMinimap.propTypes = {
  metadata: PropTypes.shape({}).isRequired
}

export default CollectionDetailsMinimap
