// @ts-expect-error The file does not have types
import { dividePolygon } from '@edsc/geo-utils'
import {
  booleanClockwise,
  booleanContains,
  polygon as turfPolygon
} from '@turf/turf'
import type { Feature, Position } from 'geojson'

import type { ShapefileFile } from '../../types/sharedTypes'

type LatLng = { lat: number, lng: number }

// A ring crosses the antimeridian if any longitude is outside of [-180, 180], or if two
// consecutive points are more than 180 degrees of longitude apart (the shortest path between
// them crosses the antimeridian)
const ringCrossesAntimeridian = (ring: Position[]) => ring.some(([lng], index) => {
  if (lng > 180 || lng < -180) return true
  if (index === 0) return false

  const [previousLng] = ring[index - 1]

  return Math.abs(lng - previousLng) > 180
})

const polygonCrossesAntimeridian = (polygon: Position[][]) => (
  polygon.some(ringCrossesAntimeridian)
)

const closeRing = (ring: Position[]): Position[] => {
  const [firstLng, firstLat] = ring[0]
  const [lastLng, lastLat] = ring[ring.length - 1]

  if (firstLng !== lastLng || firstLat !== lastLat) return [...ring, ring[0]]

  return ring
}

// Exterior rings should be counter-clockwise and holes should be clockwise
const makeCounterClockwise = (ring: Position[]) => (
  booleanClockwise(ring) ? [...ring].reverse() : ring
)

const makeClockwise = (ring: Position[]) => (
  booleanClockwise(ring) ? ring : [...ring].reverse()
)

// Divide a single ring into one or more closed rings, one for each side of the antimeridian
const divideRing = (ring: Position[]): Position[][] => {
  const { interiors } = dividePolygon(ring.map(([lng, lat]) => ({
    lng,
    lat
  })))

  return interiors
    .map((interior: LatLng[]) => closeRing(interior.map(({ lng, lat }) => [lng, lat])))
    // A valid GeoJSON linear ring needs at least 4 positions
    .filter((dividedRing: Position[]) => dividedRing.length >= 4)
}

// Divide a polygon (exterior ring plus optional holes) into multiple polygons. Each hole
// is divided as well, and each piece is added to the polygon that contains it.
const dividePolygonWithHoles = (polygon: Position[][]): Position[][][] => {
  const [exterior, ...holes] = polygon

  const dividedPolygons = divideRing(exterior).map((ring) => [makeCounterClockwise(ring)])

  holes.forEach((hole) => {
    divideRing(hole).forEach((holePiece) => {
      const holePolygon = turfPolygon([holePiece])

      const containingPolygon = dividedPolygons.find(
        ([dividedExterior]) => booleanContains(turfPolygon([dividedExterior]), holePolygon)
      )

      if (containingPolygon) containingPolygon.push(makeClockwise(holePiece))
    })
  })

  return dividedPolygons
}

// If a feature is a Polygon or MultiPolygon that crosses the antimeridian, return the feature
// with its geometry divided into a MultiPolygon with a polygon on each side of the antimeridian
const splitFeatureOnAntimeridian = (feature: Feature): Feature => {
  const { geometry } = feature

  if (!geometry) return feature

  let polygons: Position[][][]
  if (geometry.type === 'Polygon') {
    polygons = [geometry.coordinates]
  } else if (geometry.type === 'MultiPolygon') {
    polygons = geometry.coordinates
  } else {
    return feature
  }

  if (!polygons.some(polygonCrossesAntimeridian)) return feature

  return {
    ...feature,
    geometry: {
      type: 'MultiPolygon',
      coordinates: polygons.flatMap((polygon) => (
        polygonCrossesAntimeridian(polygon) ? dividePolygonWithHoles(polygon) : [polygon]
      ))
    }
  }
}

/**
 * Split any Polygon or MultiPolygon features in the shapefile that cross the antimeridian
 * into a MultiPolygon, with one polygon on each side of the antimeridian. Each feature keeps
 * its properties (including the edscId), so the pieces are still selected together as one shape.
 * @param file The shapefile as a GeoJSON FeatureCollection
 */
const splitShapefileOnAntimeridian = (file: ShapefileFile): ShapefileFile => ({
  ...file,
  features: file.features.map(splitFeatureOnAntimeridian)
})

export default splitShapefileOnAntimeridian
