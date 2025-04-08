import { circular } from 'ol/geom/Polygon'
import { Feature } from 'ol'
import {
  LineString,
  Point,
  Polygon
} from 'ol/geom'

import { splitListOfPoints } from '@edsc/geo-utils'

import { crsProjections } from './crs'
import { interpolateBoxPolygon, interpolatePolygon } from './normalizeSpatial'
import projections from './projections'
import {
  spatialSearchMarkerStyle,
  mbrStyle,
  spatialSearchStyle
} from './styles'

/**
 * Draws the current spatial search query on the map
 * @param {Object} params
 * @param {Object} params.spatialSearch Spatial search object from the store
 * @param {String} params.projectionCode Projection Code for the current map projection
 * @param {Object} params.vectorSource OL Vector Source to draw the spatial on
 */
const drawSpatialSearch = ({
  spatialSearch,
  projectionCode,
  vectorSource
}) => {
  vectorSource.clear()

  const {
    advancedSearch,
    boundingBoxSearch,
    circleSearch,
    drawingNewLayer,
    pointSearch,
    polygonSearch,
    showMbr
  } = spatialSearch

  // If new spatial is being drawn, don't draw the existing spatial
  if (drawingNewLayer !== false) return

  // Draw the advanced search spatial. This will be a polygon or a line depending on the user selection
  if (advancedSearch) {
    const { regionSearch = {} } = advancedSearch
    const { selectedRegion = {} } = regionSearch
    const {
      spatial: regionSpatial,
      type
    } = selectedRegion

    if (regionSpatial) {
      const points = splitListOfPoints(regionSpatial)

      if (selectedRegion && regionSpatial) {
        let geometry

        if (type === 'reach') {
          // Draw a line for the reach
          const lineCoordinates = points.map((point) => {
            const [lng, lat] = point.split(',')

            return [parseFloat(lng), parseFloat(lat)]
          })

          const line = new LineString(lineCoordinates)

          const lineInProjection = line.transform(
            crsProjections[projections.geographic],
            crsProjections[projectionCode]
          )

          geometry = lineInProjection
        } else {
          // Draw a polygon for the HUC
          const polygonCoordinates = points.map((point) => {
            const [lng, lat] = point.split(',')

            return [parseFloat(lng), parseFloat(lat)]
          })

          const polygon = new Polygon([polygonCoordinates])

          const polygonInProjection = polygon.transform(
            crsProjections[projections.geographic],
            crsProjections[projectionCode]
          )

          geometry = polygonInProjection
        }

        const feature = new Feature({
          geometry
        })

        feature.setStyle(spatialSearchStyle)

        vectorSource.addFeature(feature)
      }
    }
  }

  // Draw a polygon for the bounding box search
  if (boundingBoxSearch) {
    const [swLon, swLat, neLon, neLat] = boundingBoxSearch[0].split(',').map(Number)

    const polygonCoordinates = [
      [swLon, swLat],
      [neLon, swLat],
      [neLon, neLat],
      [swLon, neLat],
      [swLon, swLat]
    ]

    let polygonInProjection

    if (projectionCode === projections.geographic) {
      // The coordinates are already in the geographic projection
      polygonInProjection = new Polygon([polygonCoordinates])
    } else {
      // Interpolate the polygon to ensure it has enough points to make sense in the polar projections
      const interpolatedPolygonCoordinates = interpolateBoxPolygon(polygonCoordinates, 2, 6)

      const polygon = new Polygon(interpolatedPolygonCoordinates)

      // Ensure the polygon is in the correct projection
      polygonInProjection = polygon.transform(
        crsProjections[projections.geographic],
        crsProjections[projectionCode]
      )
    }

    // Create the feature and add it to the vector source
    const feature = new Feature({
      geometry: polygonInProjection
    })

    feature.setStyle(spatialSearchStyle)

    vectorSource.addFeature(feature)
  }

  // Draw a circular polygon for the circle search
  if (circleSearch) {
    const [lon, lat, radiusInMeters] = circleSearch[0].split(',').map(Number)

    // Create the circular polygon. 64 is the number of points in the circle
    const circle = circular([lon, lat], radiusInMeters, 64)
    const circleInProjection = circle.transform(
      crsProjections[projections.geographic],
      crsProjections[projectionCode]
    )

    // Create the feature and add it to the vector source
    const feature = new Feature(circleInProjection)

    feature.setStyle(spatialSearchStyle)

    vectorSource.addFeature(feature)
  }

  // Draw a point for the point search
  if (pointSearch) {
    const point = new Point(pointSearch[0].split(','))

    let pointInProjection = point

    // If the projection is not geographic, transform the point to the current projection
    if (projectionCode !== projections.geographic) {
      pointInProjection = point.transform(
        crsProjections[projections.geographic],
        crsProjections[projectionCode]
      )
    }

    // Create the feature and add it to the vector source
    const feature = new Feature({
      geometry: pointInProjection
    })

    feature.setStyle(spatialSearchMarkerStyle)

    vectorSource.addFeature(feature)
  }

  // Draw a polygon for the polygon search
  if (polygonSearch) {
    const [polygonCoordinates = ''] = polygonSearch
    const coordinates = polygonCoordinates.split(',').reduce((acc, coord, polygonsIndex) => {
      if (polygonsIndex % 2 === 0) {
        acc.push({
          lng: parseFloat(coord),
          lat: parseFloat(polygonCoordinates.split(',')[polygonsIndex + 1])
        })
      }

      return acc
    }, [])

    // Interpolate the polygon so that it follows the curvature of the earth
    const interpolatedCoordinates = interpolatePolygon(coordinates)

    const polygon = new Polygon(interpolatedCoordinates)

    let polygonInProjection = polygon

    // If the projection is not geographic, transform the polygon to the current projection
    if (projectionCode !== projections.geographic) {
      polygonInProjection = polygon.transform(
        crsProjections[projections.geographic],
        crsProjections[projectionCode]
      )
    }

    // Create the feature and add it to the vector source
    const feature = new Feature({
      geometry: polygonInProjection
    })

    feature.setStyle(spatialSearchStyle)

    vectorSource.addFeature(feature)
  }

  // If the spatial polygon warning is enabled, add an MBR around the shape
  if (showMbr) {
    // Loop through all the features in the vector source
    vectorSource.getFeatures().forEach((feature) => {
      // Get the extent of the feature (which is the MBR)
      const extent = feature.getGeometry().getExtent()

      // Create a polygon from the extent
      const polygon = new Polygon([
        [
          [extent[0], extent[1]],
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]]
        ]
      ])

      let polygonInProjection = polygon

      // If the projection is not geographic, transform the polygon to the current projection
      if (projectionCode !== projections.geographic) {
        polygonInProjection = polygon.transform(
          crsProjections[projections.geographic],
          crsProjections[projectionCode]
        )
      }

      // Create the feature and add it to the vector source
      const mbrFeature = new Feature({
        geometry: polygonInProjection
      })

      mbrFeature.setStyle(mbrStyle)

      vectorSource.addFeature(mbrFeature)
    })
  }
}

export default drawSpatialSearch
