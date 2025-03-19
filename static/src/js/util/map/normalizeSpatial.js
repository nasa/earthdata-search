import { greatCircleArc } from 'ol/geom/flat/geodesic'
import { distance } from 'ol/coordinate'
import { dividePolygon } from '@edsc/geo-utils'
import {
  area as turfArea,
  booleanContains,
  polygon as turfPolygon,
  simplify,
  booleanClockwise
} from '@turf/turf'

import { crsProjections } from './crs'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { mapPointsSimplifyThreshold } = getApplicationConfig()

/**
 * Converts square meters to square kilometers
 * @param {number} squareMeters - The area in square meters
 * @returns {number} The area in square kilometers
 */
export const squareMetersToSquareKilometers = (squareMeters) => parseInt(squareMeters / 1000000, 10)

// This function adds points to the polygon so that the polygon follows the curvature of the Earth
const interpolatePolygon = (coordinates) => {
  const interpolatedCoordinates = []

  // Iterate over the coordinates and add the original point and the interpolated points
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    const { lng, lat } = coordinates[i]
    const { lng: lng2, lat: lat2 } = coordinates[i + 1]

    // `greatCircleArc` sometimes changes the first point slightly. We want to keep the original point to ensure the polygon is closed
    interpolatedCoordinates.push([lng, lat])

    // Interpolate the points between the two coordinates
    const interpolated = greatCircleArc(lng, lat, lng2, lat2, crsProjections.epsg4326, 0.00001)

    // Pair the interpolated coordinates before pushing them to the array
    for (let j = 2; j < interpolated.length - 3; j += 2) {
      interpolatedCoordinates.push([interpolated[j], interpolated[j + 1]])
    }
  }

  // `greatCircleArc` sometimes changes the last point slightly. We want to keep the original point to ensure the polygon is closed
  interpolatedCoordinates.push([coordinates[0].lng, coordinates[0].lat])

  return [interpolatedCoordinates]
}

// Interpolate the points of a polygon derived from a bounding box
const interpolateBoxPolygon = (polygon, tolerance, maxDepth) => {
  const interpolatedPolygon = polygon

  // This is a cartesian interpolation function that adds points between each point in the polygon
  const interpolate = (coordinates) => {
    const interpolatedPoints = []

    // Iterate over the coordinates and add the original point and the interpolated points
    coordinates.forEach((point, index) => {
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
const divideLine = (line) => {
  // Iterate over the coordinates and find the antimeridian crossing
  const dividedCoordinates = []
  let currentLine = []
  let previousLng = null
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
const makeCounterClockwise = (polygon) => {
  if (booleanClockwise(polygon)) {
    return polygon.reverse()
  }

  return polygon
}

// Return the given polygon as clockwise
// Exterior rings of polygons should be counter-clockwise and holes should be clockwise
const makeClockwise = (polygon) => {
  if (!booleanClockwise(polygon)) {
    return polygon.reverse()
  }

  return polygon
}

// Return the area of the given polygon in square meters
export const getPolygonArea = (polygon) => turfArea(polygon)

// Normalize spatial metadata (boxes, lines, points, polygons) to polygons for simplified handling on the map
const normalizeSpatial = (metadata) => {
  const {
    boxes,
    lines,
    points,
    polygons
  } = metadata

  // If the granule has a box, return a MultiPolygon
  if (boxes) {
    const multiPolygons = []
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
      const interpolatedPolygon = interpolateBoxPolygon(polygonCoordinates, 2, 6)

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
    const multipleLines = []
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
    const json = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: multipleLines
      }
    }

    // Get the number of points in the line
    const numPoints = json.geometry.coordinates.reduce((acc, line) => acc + line.length, 0)

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
    const multiPoints = []
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
    let polygonsArray = []

    polygons.forEach((polygonWithHoles) => {
      // If more than one polygon is within polygonWithHoles, the first polygon is the exterior and the rest are holes

      polygonWithHoles.forEach((polygon, polygonWithHolesIndex) => {
        // `polygons` is an array of an array of coordinates that looks like this:
        // [ ["0 0 0 1 1 1 1 0 0 0"] ]
        // We need to convert this into an array of arrays of coordinates
        // that looks like this:
        // [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
        const coordinates = polygon.split(' ').reduce((acc, coord, polygonsIndex) => {
          if (polygonsIndex % 2 === 0) {
            acc.push([parseFloat(polygon.split(' ')[polygonsIndex + 1]), parseFloat(coord)])
          }

          return acc
        }, [])

        // Divide the polygon to handle antimeridian crossing
        const { interiors: dividedCoordinates } = dividePolygon(coordinates.map(([lng, lat]) => ({
          lng,
          lat
        })))

        const [closedDividedCoordinates] = [dividedCoordinates.map((interior) => {
          // If the interior is not closed, close it
          if (
            interior[0].lng !== interior[interior.length - 1].lng
            || interior[0].lat !== interior[interior.length - 1].lat
          ) {
            return interior.concat([interior[0]])
          }

          return interior
        })]

        closedDividedCoordinates.forEach((polygonPoints) => {
          if (polygonPoints.length < 3) return

          const interpolatedPolygon = interpolatePolygon(polygonPoints)

          // If polygonWithHolesIndex is 0, it is an exterior polygon
          if (polygonWithHolesIndex === 0) {
            // Add each exterior polygon to the list
            polygonsArray.push(makeCounterClockwise(interpolatedPolygon))
          } else {
            // If polygonWithHolesIndex is > 0, it is a hole in a polygon, it needs to be added to
            // the correct polygon array

            // Look through multiPolygons and determine if the hole fits inside
            polygonsArray = polygonsArray.map((polygonsItem) => {
              const exterior = turfPolygon(polygonsItem)
              const hole = turfPolygon(interpolatedPolygon)

              const containsHole = booleanContains(exterior, hole)

              if (containsHole) {
                return polygonsItem.concat(makeClockwise(interpolatedPolygon))
              }

              return polygonsItem
            })
          }
        })
      })
    })

    // Return the polygons as GeoJSON MultiPolygon (to simplify drawing on the map)
    const json = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: polygonsArray
      }
    }

    const numPoints = json.geometry.coordinates.reduce((acc, polygon) => acc + polygon[0].length, 0)

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
