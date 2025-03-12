import { greatCircleArc } from 'ol/geom/flat/geodesic'
import { dividePolygon } from '@edsc/geo-utils'
import { simplify } from '@turf/turf'

import { crsProjections } from './crs'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { mapPointsSimplifyThreshold } = getApplicationConfig()

// This function adds points to the polygon so that the polygon follows the curvature of the Earth
const interpolatePolygon = (coordinates) => {
  // Interpolate the polygon coordinates so that the polygon follows the curvature of the Earth
  const interpolatedCoordinates = []
  for (let i = 0; i < coordinates.length - 1; i += 1) {
    const { lng, lat } = coordinates[i]
    const { lng: lng2, lat: lat2 } = coordinates[i + 1]

    const interpolated = greatCircleArc(lng, lat, lng2, lat2, crsProjections.epsg4326, 0.00001)

    // Pair the interpolated coordinates before pushing them to the array
    for (let j = 0; j < interpolated.length - 1; j += 2) {
      interpolatedCoordinates.push([interpolated[j], interpolated[j + 1]])
    }
  }

  return [interpolatedCoordinates]
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

// Normalize granule spatial (boxes, lines, points, polygons) to polygons for simplified handling on the map
const normalizeGranuleSpatial = (granule) => {
  const {
    boxes,
    lines,
    points,
    polygons
  } = granule

  // If the granule has a box, return a MultiPolygon
  if (boxes) {
    const multiPolygons = []
    boxes.forEach((box) => {
      // `boxes` is an array of strings that looks like this:
      // ["swLon swLat neLon neLat"]
      const [swLat, swLon, neLat, neLon] = box.split(' ').map((coord) => parseFloat(coord))

      // Create a polygon from the bounding box
      const polygonCoordinates = [
        [swLon, swLat],
        [swLon, neLat],
        [neLon, neLat],
        [neLon, swLat],
        [swLon, swLat]
      ]
      multiPolygons.push([polygonCoordinates])
    })

    // Return the bounding box as GeoJSON MultiPolygon
    return {
      type: 'Feature',
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
      geometry: {
        type: 'MultiPoint',
        coordinates: multiPoints
      }
    }
  }

  // If the granule has a polygon, return a GeoJSON MultiPolygon
  if (polygons) {
    const multiPolygons = []
    polygons.forEach((polygon) => {
      polygon.forEach((shape) => {
        // `polygons` is an array of an array of coordinates that looks like this:
        // [ ["0 0 0 1 1 1 1 0 0 0"] ]
        // We need to convert this into an array of arrays of coordinates
        // that looks like this:
        // [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
        const coordinates = shape.split(' ').reduce((acc, coord, polygonsIndex) => {
          if (polygonsIndex % 2 === 0) {
            acc.push([parseFloat(shape.split(' ')[polygonsIndex + 1]), parseFloat(coord)])
          }

          return acc
        }, [])

        // Divide the polygon to handle antimeridian crossing
        const { interiors: dividedCoordinates } = dividePolygon(coordinates.map(([lng, lat]) => ({
          lng,
          lat
        })))

        dividedCoordinates.forEach((p) => {
          if (p.length < 3) return

          const interpolatedPolygon = interpolatePolygon(p)
          multiPolygons.push(interpolatedPolygon)
        })
      })
    })

    // Return the polygons as GeoJSON MultiPolygon (to simplify drawing on the map)
    const json = {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: multiPolygons
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

export default normalizeGranuleSpatial
