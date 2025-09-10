import { transform } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import { Feature } from 'ol'
import {
  Geometry as OlGeometry,
  Point,
  SimpleGeometry
} from 'ol/geom'
import Polygon, { circular } from 'ol/geom/Polygon'
import VectorSource from 'ol/source/Vector'
import type {
  Geometry as GeoJsonGeometry,
  MultiPolygon as GeoJsonMultiPolygon,
  Polygon as GeoJsonPolygon
} from 'geojson'

import { spatialSearchMarkerStyle, spatialSearchStyle } from './styles'
import getQueryFromShapefileFeature from './getQueryFromShapefileFeature'
import projectionCodes from '../../constants/projectionCodes'
import spatialTypes from '../../constants/spatialTypes'
import { crsProjections } from './crs'

import { eventEmitter } from '../../events/events'
import { mapEventTypes } from '../../constants/eventTypes'

import {
  ProjectionCode,
  Query,
  ShapefileFile
} from '../../types/sharedTypes'
import { ShapefileSlice } from '../../zustand/types'

/**
 * Draws NLP spatial data on the map
 * @param {Object} params - Drawing parameters
 */
const drawSpatialData = ({
  drawingNewLayer,
  selectedFeatures,
  spatialData,
  onChangeQuery,
  onChangeProjection,
  onMetricsMap,
  onUpdateShapefile,
  projectionCode,
  spatialDataAdded,
  vectorSource
}: {
  /** If a new layer is being drawn */
  drawingNewLayer: boolean | string
  /** The currently selected features */
  selectedFeatures?: string[] | null
  /** The spatial data to draw */
  spatialData: ShapefileFile
  /** Callback to update the query */
  onChangeQuery: (query: Query) => void
  /** Callback to update the map projection */
  onChangeProjection?: (newProjectionCode: ProjectionCode) => void
  /** Callback to send metrics events */
  onMetricsMap: (eventName: string) => void
  /** Callback to update the shapefile store */
  onUpdateShapefile: ShapefileSlice['shapefile']['updateShapefile']
  /** The current map projection */
  projectionCode: keyof typeof crsProjections
  /** If the spatial data was just added */
  spatialDataAdded: boolean
  /** The source to draw the spatial data on */
  vectorSource: VectorSource
}) => {
  vectorSource.clear()

  if (drawingNewLayer !== false) return

  // Create features from the GeoJSON data
  const features = new GeoJSON().readFeatures(spatialData)
  if (!features.length) return

  const numFeatures = features.length

  features.forEach((feature) => {
    feature.set('isSpatialData', true)
    feature.set('selected', false)
    feature.set('projectionCode', projectionCodes.geographic)

    const geometry = feature.getGeometry() as unknown as SimpleGeometry
    const geometryType = geometry?.getType()
    const radius = feature.get('radius')

    feature.set('geographicCoordinates', (geometry as Polygon).getCoordinates(true))

    let geometryInProjection = geometry.clone()

    if (projectionCode !== projectionCodes.geographic) {
      geometryInProjection = geometryInProjection.transform(
        crsProjections[projectionCodes.geographic],
        crsProjections[projectionCode]
      )
    }

    feature.setGeometry(geometryInProjection)

    // If the feature is a point with a radius, create a circle from the point
    if (geometryType === spatialTypes.POINT && radius) {
      const circle = circular((geometryInProjection as Point).getCoordinates(), radius, 64)

      feature.set('circleGeometry', [geometry.getCoordinates(), radius])
      feature.set('geometryType', spatialTypes.CIRCLE)

      feature.setGeometry(circle)
    } else {
      feature.set('geometryType', geometryType)
    }

    if (geometryType === spatialTypes.POINT && !radius) {
      feature.setStyle(spatialSearchMarkerStyle)
    } else {
      feature.setStyle(spatialSearchStyle)
    }

    const edscId = feature.get('edscId')
    if (
      (selectedFeatures && selectedFeatures.includes(edscId))
      || (!selectedFeatures && numFeatures === 1)
    ) {
      feature.set('selected', true)
    }
  })

  vectorSource.addFeatures(features)

  // If there are no selected features and there is only one feature,
  // Update the spatial query and selectedFeatures
  if (!selectedFeatures && numFeatures === 1) {
    const feature = features[0]

    // Add the feature's geometry as the spatial query
    onChangeQuery({
      collection: {
        spatial: getQueryFromShapefileFeature(feature)
      }
    })

    const edscId = feature.get('edscId')
    onUpdateShapefile({ selectedFeatures: [edscId] })
  }

  // Handle projection changes for polar regions if callback is provided
  if (spatialDataAdded && onChangeProjection) {
    const sourceExtent = vectorSource.getExtent()

    let geographicExtent = sourceExtent
    // If the current projection is not geographic, transform extent to geographic coordinates
    if (projectionCode !== projectionCodes.geographic) {
      const swPoint = transform(
        [sourceExtent[0], sourceExtent[1]],
        crsProjections[projectionCode],
        crsProjections[projectionCodes.geographic]
      )
      const nePoint = transform(
        [sourceExtent[2], sourceExtent[3]],
        crsProjections[projectionCode],
        crsProjections[projectionCodes.geographic]
      )

      geographicExtent = [swPoint[0], swPoint[1], nePoint[0], nePoint[1]]
    }

    const latitudes = geographicExtent.filter((value, index) => index % 2 === 1)

    const allLatitudesInArctic = latitudes.every((latitude) => latitude > 66.5)
    const allLatitudesInAntarctic = latitudes.every((latitude) => latitude < -66.5)

    let newProjection
    if (allLatitudesInArctic) newProjection = projectionCodes.arctic
    if (allLatitudesInAntarctic) newProjection = projectionCodes.antarctic

    if (newProjection) {
      onChangeProjection(newProjection)
    }
  }

  if (spatialDataAdded) {
    onMetricsMap('Added NLP Spatial Data')

    // SetTimeout is needed because the map needs to render before it can be moved
    setTimeout(() => {
      eventEmitter.emit(mapEventTypes.MOVEMAP, {
        source: vectorSource
      })
    }, 0)
  }
}

/**
 * Draws NLP spatial data on the map with simplified functionality
 * @param {Object} params - Drawing parameters
 */
export const drawNlpSpatialData = ({
  geometry,
  label,
  projectionCode,
  vectorSource,
  onChangeProjection
}: {
  /** The NLP geometry to draw */
  geometry: GeoJsonGeometry
  /** Optional label for this geometry */
  label?: string
  /** The current map projection */
  projectionCode: keyof typeof crsProjections
  /** The source to draw the spatial data on */
  vectorSource: VectorSource
  /** Optional callback to update the map projection */
  onChangeProjection?: (newProjectionCode: ProjectionCode) => void
}) => {
  vectorSource.clear()

  let normalizedGeometry: GeoJsonGeometry = geometry
  if (geometry?.type === 'Polygon' && Array.isArray((geometry as GeoJsonPolygon).coordinates)) {
    const rings = (geometry as GeoJsonPolygon).coordinates
    normalizedGeometry = {
      ...geometry,
      coordinates: rings.map((ring) => {
        if (!ring?.length) return ring
        const first = ring[0]
        const last = ring[ring.length - 1]
        if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
          return ring.concat([first])
        }

        return ring
      })
    } as GeoJsonPolygon
  }

  if (geometry?.type === 'MultiPolygon' && Array.isArray((geometry as GeoJsonMultiPolygon).coordinates)) {
    const polys = (geometry as GeoJsonMultiPolygon).coordinates
    normalizedGeometry = {
      ...geometry,
      coordinates: polys.map((poly) => (
        (poly || []).map((ring) => {
          if (!ring?.length) return ring
          const first = ring[0]
          const last = ring[ring.length - 1]
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
  feature.set('isSpatialData', true)
  feature.set('projectionCode', projectionCodes.geographic)
  if (label) feature.set('name', label)

  const geomGeographic = feature.getGeometry() as unknown as SimpleGeometry
  const geometryType = geomGeographic?.getType()
  const radius = feature.get('radius')

  feature.set(
    'geographicCoordinates',
    (geomGeographic as Polygon).getCoordinates(true)
  )

  const geoShapeForMove: OlGeometry = geomGeographic.clone()

  let geometryInProjection = geomGeographic.clone()
  if (projectionCode !== projectionCodes.geographic) {
    geometryInProjection = geometryInProjection.transform(
      crsProjections[projectionCodes.geographic],
      crsProjections[projectionCode]
    )
  }

  feature.setGeometry(geometryInProjection)

  // If the feature is a point with a radius, create a circle from the point
  if (geometryType === spatialTypes.POINT && radius) {
    const center = (geometryInProjection as Point).getCoordinates()
    const circle = circular(center, radius, 64)
    feature.set('circleGeometry', [geomGeographic.getCoordinates(), radius])
    feature.set('geometryType', spatialTypes.CIRCLE)
    feature.setGeometry(circle)
  } else {
    feature.set('geometryType', geometryType)
  }

  if (geometryType === spatialTypes.POINT && !radius) {
    feature.setStyle(spatialSearchMarkerStyle)
  } else {
    feature.setStyle(spatialSearchStyle)
  }

  vectorSource.addFeature(feature)

  if (onChangeProjection) {
    const sourceExtent = vectorSource.getExtent()

    let geographicExtent = sourceExtent
    if (projectionCode !== projectionCodes.geographic) {
      const swPoint = transform(
        [sourceExtent[0], sourceExtent[1]],
        crsProjections[projectionCode],
        crsProjections[projectionCodes.geographic]
      )
      const nePoint = transform(
        [sourceExtent[2], sourceExtent[3]],
        crsProjections[projectionCode],
        crsProjections[projectionCodes.geographic]
      )

      geographicExtent = [swPoint[0], swPoint[1], nePoint[0], nePoint[1]]
    }

    const latitudes = geographicExtent.filter((value, index) => index % 2 === 1)

    const allLatitudesInArctic = latitudes.every((latitude) => latitude > 66.5)
    const allLatitudesInAntarctic = latitudes.every((latitude) => latitude < -66.5)

    let newProjection
    if (allLatitudesInArctic) newProjection = projectionCodes.arctic
    if (allLatitudesInAntarctic) newProjection = projectionCodes.antarctic

    if (newProjection) {
      onChangeProjection(newProjection)
    }
  }

  // Attempt to move map to this source when valid
  setTimeout(() => {
    eventEmitter.emit(mapEventTypes.MOVEMAP, {
      shape: geoShapeForMove
    })
  }, 0)
}

export default drawSpatialData
