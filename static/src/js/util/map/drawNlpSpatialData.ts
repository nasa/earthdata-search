import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from 'ol'
import { SimpleGeometry } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import type { Geometry as GeoJsonGeometry } from 'geojson'

import { spatialSearchMarkerStyle, spatialSearchStyle } from './styles'
import projectionCodes from '../../constants/projectionCodes'
import spatialTypes from '../../constants/spatialTypes'
import { crsProjections } from './crs'

import { eventEmitter } from '../../events/events'
import { mapEventTypes } from '../../constants/eventTypes'

// Draw NLP spatial data on the map with simplified behavior
export const drawNlpSpatialData = ({
  geometry,
  projectionCode,
  vectorSource
}: {
  /** The GeoJSON geometry (Point | Polygon | MultiPolygon) */
  geometry: GeoJsonGeometry
  /** The target projection code to draw in */
  projectionCode: keyof typeof crsProjections
  /** The vector source to clear and populate and also used for MOVEMAP fit. */
  vectorSource: VectorSource
}) => {
  vectorSource.clear()

  const olGeometry = new GeoJSON().readGeometry(geometry)

  if (!olGeometry) return

  const feature = new Feature({ geometry: olGeometry })

  const geomGeographic = feature.getGeometry() as unknown as SimpleGeometry
  const geometryType = geomGeographic?.getType()
  const radius = feature.get('radius')

  // Clone geometry before transform to avoid mutating the original
  let geometryInProjection = geomGeographic.clone()
  if (projectionCode !== projectionCodes.geographic) {
    geometryInProjection = geometryInProjection.transform(
      crsProjections[projectionCodes.geographic],
      crsProjections[projectionCode]
    )
  }

  feature.setGeometry(geometryInProjection)

  // Points without radius use marker style, everything else uses polygon style
  if (geometryType === spatialTypes.POINT && !radius) {
    feature.setStyle(spatialSearchMarkerStyle)
  } else {
    feature.setStyle(spatialSearchStyle)
  }

  vectorSource.addFeature(feature)

  // Use setTimeout to avoid race condition with map extent fitting
  setTimeout(() => {
    eventEmitter.emit(mapEventTypes.MOVEMAP, {
      source: vectorSource
    })
  }, 0)
}
