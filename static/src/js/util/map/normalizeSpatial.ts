// @ts-expect-error The file does not have types
import { dividePolygon } from '@edsc/geo-utils'
import {
  booleanContains,
  polygon as turfPolygon,
  simplify,
  booleanClockwise,
  greatCircle,
  flattenEach,
  cleanCoords,
  distance,
  truncate,
  Coord
} from '@turf/turf'
import {
  Feature,
  GeoJsonProperties,
  Geometry
} from 'geojson'

// @ts-expect-error The file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import {
  BoundingBoxString,
  LineString,
  PointString,
  PolygonString
} from '../../types/sharedTypes'

import useEdscStore from '../../zustand/useEdscStore'

const { mapPointsSimplifyThreshold } = getApplicationConfig()

// This function adds points to the polygon so that the polygon follows the curvature of the Earth
export const interpolatePolygon = (coordinates: { lng: number, lat: number }[]) => {
  const interpolatedCoordinates = []

  // Iterate over the coordinates and add the original point and the interpolated points
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    const coordinate = [coordinates[i].lng, coordinates[i].lat]
    const nextCoordinate = [coordinates[i + 1].lng, coordinates[i + 1].lat]

    // `greatCircle` sometimes changes the first point slightly. We want to keep the original point to ensure the polygon is closed
    interpolatedCoordinates.push(coordinate)

    // Calculate the number of points to interpolate between the two coordinates
    // To do this, we find the distance between the two points relative to the circumference of the Earth, then take that percentage of our maximum number of points
    const distanceBetweenPoints = distance(coordinate, nextCoordinate)

    // The circumference of the Earth is approximately 40,000 km
    const distancePercentage = distanceBetweenPoints / 40000

    // We want to use a maximum of 50 points to interpolate between the two coordinates, so take the
    // `distancePercentage` and multiply it by 50 to get the number of points to interpolate.
    // Set to 40 here, will add 10 points next. 50 was choosen through trial and error
    const maxPoints = 40

    // Add 10 points to the total to ensure there are always a good number of points for smooth curves
    const numberOfPoints = Math.floor(distancePercentage * maxPoints) + 10

    try {
      // Interpolate the points between the two coordinates
      const turfInterpolated = greatCircle(
        coordinate,
        nextCoordinate,
        { npoints: numberOfPoints }
      )

      flattenEach(turfInterpolated, (currentFeature) => {
        const flattenedCoords = currentFeature.geometry.coordinates

        flattenedCoords.forEach((flattenedCoord, index) => {
          // The first and last points are the same as the original points, don't add them again
          if (index === 0 || index === flattenedCoords.length - 1) return

          const nextFlattenedCoord = flattenedCoords[index + 1]

          // If the next point is too close (< 100km) to the current point, don't add it
          const pointDistance = distance(flattenedCoord as Coord, nextFlattenedCoord as Coord)
          if (pointDistance < 100) return

          interpolatedCoordinates.push(flattenedCoord)
        })
      })
    } catch (error) {
      useEdscStore.getState().errors.handleError({
        action: 'interpolatePolygon',
        error,
        message: `Error interpolating points: start: ${coordinate}, end: ${nextCoordinate}. All coordiates: ${JSON.stringify(coordinates)}. Full error: ${error}`,
        notificationType: 'none'
      })
    }
  }

  // `greatCircle` sometimes changes the last point slightly. We want to keep the original point to ensure the polygon is closed
  interpolatedCoordinates.push([coordinates[0].lng, coordinates[0].lat])

  return [interpolatedCoordinates]
}

// Interpolate the points of a polygon derived from a bounding box
export const interpolateBoxPolygon = (polygon: number[][], tolerance: number, maxDepth: number) => {
  const interpolatedPolygon = polygon

  // This is a cartesian interpolation function that adds points between each point in the polygon
  const interpolate = (coordinates: number[][]) => {
    const interpolatedPoints: number[][] = []

    // Iterate over the coordinates and add the original point and the interpolated points
    coordinates.forEach((point: number[], index: number) => {
      interpolatedPoints.push(point)

      const nextIndex = index + 1 === coordinates.length ? 0 : index + 1
      const nextPoint = coordinates[nextIndex]

      // Take the average of the two points to get the midpoint
      const lng = (point[0] + nextPoint[0]) / 2
      const lat = (point[1] + nextPoint[1]) / 2
      const newPoint = [lng, lat]

      // Find the distance between the two points
      const pointDistance = distance(point, newPoint)

      // If the distance between the two points is greater than the tolerance, add the new point
      if (pointDistance > tolerance) {
        interpolatedPoints.push(newPoint)
      }
    })

    return interpolatedPoints
  }

  // Interpolate the polygon until it has more points than the threshold
  for (let i = 0; i < maxDepth; i += 1) {
    const newInterpolatedPoints = interpolate(interpolatedPolygon)

    // If the new interpolated points are greater than the threshold, break
    if (newInterpolatedPoints.length > mapPointsSimplifyThreshold) {
      break
    }

    // Replace the interpolated polygon with the new interpolated points
    interpolatedPolygon.splice(0, interpolatedPolygon.length)
    interpolatedPolygon.push(...newInterpolatedPoints)
  }

  return [interpolatedPolygon]
}

// If the line crosses the antimeridian, divide it and return the divided coordinates
// This needs to split every time the line crosses the antimeridian
const divideLine = (line: string) => {
  // Iterate over the coordinates and find the antimeridian crossing
  const dividedCoordinates = []
  let currentLine: number[][] = []
  let previousLng: number | null = null
  const coordinates = line.split(' ')

  for (let i = 0; i < coordinates.length; i += 2) {
    const lng = parseFloat(coordinates[i + 1])
    const lat = parseFloat(coordinates[i])

    // If the previous longitude is not null and the current longitude is on the other side of the antimeridian
    if (previousLng !== null && Math.abs(previousLng - lng) > 180) {
      // If the current line is not empty, push it to the divided coordinates
      if (currentLine.length) {
        // Add a point on the antimeridian to the current line
        currentLine.push([previousLng > 0 ? 180 : -180, lat])

        // Push the current line to the divided coordinates
        dividedCoordinates.push(currentLine)

        // Start the next line with the antimeridian point
        currentLine = [[previousLng > 0 ? -180 : 180, lat]]
      }
    }

    currentLine.push([lng, lat])
    previousLng = lng
  }

  // Push the last line to the divided coordinates
  dividedCoordinates.push(currentLine)

  return dividedCoordinates
}

// Return the given polygon as counter-clockwise.
// Exterior rings of polygons should be counter-clockwise and holes should be clockwise
export const makeCounterClockwise = (polygon: number[][]) => {
  if (booleanClockwise(polygon)) {
    return polygon.reverse()
  }

  return polygon
}

// Return the given polygon as clockwise
// Exterior rings of polygons should be counter-clockwise and holes should be clockwise
const makeClockwise = (polygon: number[][]) => {
  if (!booleanClockwise(polygon)) {
    return polygon.reverse()
  }

  return polygon
}

// Normalize spatial metadata (boxes, lines, points, polygons) to polygons for simplified handling on the map
const normalizeSpatial = (metadata: {
  boxes?: BoundingBoxString[]
  lines?: LineString[]
  points?: PointString[]
  polygons?: PolygonString[][]
}): Feature<Geometry, GeoJsonProperties> | null => {
  const {
    boxes,
    lines,
    points,
    polygons
  } = metadata

  // If the granule has a box, return a MultiPolygon
  if (boxes) {
    const multiPolygons: number[][][][] = []
    boxes.forEach((box) => {
      // `boxes` is an array of strings that looks like this:
      // ["swLon swLat neLon neLat"]
      const [swLat, swLon, neLat, neLon] = box.split(' ').map((coord) => parseFloat(coord))

      // Create a polygon from the bounding box
      const polygonCoordinates = makeCounterClockwise([
        [swLon, swLat],
        [neLon, swLat],
        [neLon, neLat],
        [swLon, neLat],
        [swLon, swLat]
      ])

      // Interpolate the polygon to add points between each point
      const interpolatedPolygon = interpolateBoxPolygon(polygonCoordinates, 250, 6)

      multiPolygons.push(interpolatedPolygon)
    })

    // Return the bounding box as GeoJSON MultiPolygon
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: multiPolygons
      }
    }
  }

  // If the granule has a line, return a GeoJSON MultiLineString
  if (lines) {
    const multipleLines: number[][][] = []
    lines.forEach((line) => {
      // `lines` is an array of strings that looks like this:
      // ["47.2048 -122.4496 47.1738 -122.4015 29.5579 -95.1636 29.5856 -95.1642"]
      // These points are [lon1, lat1, lon2, lat2, lon3, lat3, lon4, lat4]
      // We need to convert it to be an array of arrays of coordinates
      // that looks like this:
      // [[-122.4496, 47.2048], [-122.4015, 47.1738], [-95.1636, 29.5579], [-95.1642, 29.5856]]

      // Divide the line to handle antimeridian crossing
      const dividedCoordinates = divideLine(line)

      multipleLines.push(...dividedCoordinates)
    })

    // Return the line as GeoJSON MultiLineString
    const json: Feature<Geometry, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: multipleLines
      }
    }

    // Get the number of points in the line
    const numPoints = multipleLines.reduce(
      (acc: number, line: number[][]) => acc + line.length,
      0
    )

    // If the line has more than mapPointsSimplifyThreshold points, simplify it to improve rendering permormance on the map
    if (numPoints > mapPointsSimplifyThreshold) {
      return simplify(json, {
        tolerance: 0.001,
        highQuality: true
      })
    }

    return json
  }

  // If the granule has a point, return a GeoJSON MultiPoint
  if (points) {
    const multiPoints: number[][] = []
    points.forEach((point) => {
      // `points` is an array of strings that looks like this:
      // ["lat lng"]
      // These points are [lng, lat]
      // We need to convert it to be an array of coordinates
      // that looks like this:
      // [lng, lat]
      const pointCoordinates = point.split(' ').reverse().map((coord) => parseFloat(coord))

      multiPoints.push(pointCoordinates)
    })

    // Return the point as GeoJSON MultiPoint
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPoint',
        coordinates: multiPoints
      }
    }
  }

  // If the granule has a polygon, return a GeoJSON MultiPolygon
  if (polygons) {
    // CMR provides polygons spatial with multiple polygons, and each polygon can have multiple holes
    //
    // Metadata that includes mutliple polygons looks like this:
    // [
    //   [polygon1],
    //   [polygon2],
    //   [polygon3]
    // ]
    //
    // The GeoJSON coordinates returned for multiple polygons should be returned like this:
    // [
    //   [
    //     [polygon1],
    //   ],
    //   [
    //     [polygon2],
    //   ],
    //   [
    //     [polygon3],
    //   ]
    // ]
    //
    // Metadata that includes a polygon with holes will look like this:
    // [
    //   [polygon1, hole1, hole2],
    // ]
    //
    // The GeoJSON coordinates returned for a polygon with holes should be returned like this:
    // [
    //   [
    //     [polygon1],
    //     [hole1],
    //     [hole2],
    //   ],
    // ]

    // If a polygon crosses the antimeridian, it will be divided into multiple polygons.
    // If that polygon also has holes, the hole needs to be applied to the correct polygon.
    // If the hole also crosses the antimeridian, it will be divided into multiple polygons, and each
    // hole will be applied to the correct polygon.
    let polygonsArray: number[][][][] = []

    polygons.forEach((polygonWithHoles) => {
      // If more than one polygon is within polygonWithHoles, the first polygon is the exterior and the rest are holes

      polygonWithHoles.forEach((polygon, polygonWithHolesIndex) => {
        // `polygons` is an array of an array of coordinates that looks like this:
        // [ ["0 0 0 1 1 1 1 0 0 0"] ]
        // We need to convert this into an array of arrays of coordinates
        // that looks like this:
        // [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
        const coordinates = polygon.split(' ').reduce((acc: number[][], coord: string, polygonsIndex: number) => {
          if (polygonsIndex % 2 === 0) {
            acc.push([parseFloat(polygon.split(' ')[polygonsIndex + 1]), parseFloat(coord)])
          }

          return acc
        }, [])

        // Divide the polygon to handle antimeridian crossing
        const { interiors: dividedCoordinates } = dividePolygon(coordinates.map(
          ([lng, lat]: number[]) => ({
            lng,
            lat
          })
        ))

        const [closedDividedCoordinates] = [
          dividedCoordinates.map((interior: { lat: number, lng: number}[]) => {
            // If the interior is not closed, close it
            if (
              interior[0].lng !== interior[interior.length - 1].lng
              || interior[0].lat !== interior[interior.length - 1].lat
            ) {
              return interior.concat([interior[0]])
            }

            return interior
          })
        ]

        closedDividedCoordinates.forEach((polygonPoints: { lat: number, lng: number}[]) => {
          if (polygonPoints.length < 3) return

          const interpolatedPolygon = interpolatePolygon(polygonPoints)

          // If polygonWithHolesIndex is 0, it is an exterior polygon
          if (polygonWithHolesIndex === 0) {
            // Add each exterior polygon to the list
            polygonsArray.push([makeCounterClockwise(interpolatedPolygon[0])])
          } else {
            // If polygonWithHolesIndex is > 0, it is a hole in a polygon, it needs to be added to
            // the correct polygon array

            // Look through multiPolygons and determine if the hole fits inside
            polygonsArray = polygonsArray.map((polygonsItem) => {
              const exterior = turfPolygon(polygonsItem)
              const hole = turfPolygon(interpolatedPolygon)

              const containsHole = booleanContains(exterior, hole)

              if (containsHole) {
                return polygonsItem.concat([makeClockwise(interpolatedPolygon[0])])
              }

              return polygonsItem
            })
          }
        })
      })
    })

    // Return the polygons as GeoJSON MultiPolygon (to simplify drawing on the map)
    const json = truncate(
      cleanCoords({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: polygonsArray
        }
      }),
      {
        precision: 10
      }
    )

    const numPoints = json.geometry.coordinates.reduce(
      (acc: number, polygon: number[][]) => acc + polygon[0].length,
      0
    )

    // If the polygon has more than mapPointsSimplifyThreshold points, simplify it to improve rendering permormance on the map
    if (numPoints > mapPointsSimplifyThreshold) {
      return simplify(json, {
        tolerance: 0.001,
        highQuality: true
      })
    }

    return json
  }

  return null
}

export default normalizeSpatial
