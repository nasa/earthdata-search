import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from 'ol'
import { SimpleGeometry } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import type {
  Geometry as GeoJsonGeometry,
  MultiPolygon as GeoJsonMultiPolygon,
  Polygon as GeoJsonPolygon
} from 'geojson'

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

  // Normalize geometry to ensure polygon rings are properly closed for OpenLayers compatibility
  let normalizedGeometry: GeoJsonGeometry = geometry
  if (geometry?.type === 'Polygon' && Array.isArray((geometry as GeoJsonPolygon).coordinates)) {
    const rings = (geometry as GeoJsonPolygon).coordinates
    normalizedGeometry = {
      ...geometry,
      coordinates: rings.map((ring) => {
        if (!ring?.length) return ring
        const first = ring[0]
        const last = ring[ring.length - 1]
        // Close ring if first and last coordinates don't match (GeoJSON spec requirement)
        if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
          return ring.concat([first])
        }

        return ring
      })
    } as GeoJsonPolygon
  }

  // Handle MultiPolygon geometries with the same ring closure normalization
  if (geometry?.type === 'MultiPolygon' && Array.isArray((geometry as GeoJsonMultiPolygon).coordinates)) {
    const polys = (geometry as GeoJsonMultiPolygon).coordinates
    normalizedGeometry = {
      ...geometry,
      coordinates: polys.map((poly) => (
        (poly || []).map((ring) => {
          if (!ring?.length) return ring

          const first = ring[0]
          const last = ring[ring.length - 1]

          // Close ring if first and last coordinates don't match (GeoJSON spec requirement)
          if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
            return ring.concat([first])
          }

          return ring
        })
      ))
    } as GeoJsonMultiPolygon
  }

  const olGeometry = new GeoJSON().readGeometry(normalizedGeometry)

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
