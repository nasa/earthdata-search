import { greatCircleArc } from 'ol/geom/flat/geodesic'
import { dividePolygon } from '@edsc/geo-utils'
import { simplify } from '@turf/turf'
import { interpolatePolygon, divideLine } from './normalizeSpatial'

// Import { crsProjections } from './crs'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { mapPointsSimplifyThreshold } = getApplicationConfig()

// // This function adds points to the polygon so that the polygon follows the curvature of the Earth
// const interpolatePolygon = (coordinates) => {
//   // Interpolate the polygon coordinates so that the polygon follows the curvature of the Earth
//   const interpolatedCoordinates = []
//   for (let i = 0; i < coordinates.length - 1; i += 1) {
//     const { lng, lat } = coordinates[i]
//     const { lng: lng2, lat: lat2 } = coordinates[i + 1]

//     const interpolated = greatCircleArc(lng, lat, lng2, lat2, crsProjections.epsg4326, 0.00001)

//     // Pair the interpolated coordinates before pushing them to the array
//     for (let j = 0; j < interpolated.length - 1; j += 2) {
//       interpolatedCoordinates.push([interpolated[j], interpolated[j + 1]])
//     }
//   }

//   return [interpolatedCoordinates]
// }

// // If the line crosses the antimeridian, divide it and return the divided coordinates
// // This needs to split every time the line crosses the antimeridian
// const divideLine = (line) => {
//   // Iterate over the coordinates and find the antimeridian crossing
//   const dividedCoordinates = []
//   let currentLine = []
//   let previousLng = null
//   const coordinates = line.split(' ')

//   for (let i = 0; i < coordinates.length; i += 2) {
//     const lng = parseFloat(coordinates[i + 1])
//     const lat = parseFloat(coordinates[i])

//     // If the previous longitude is not null and the current longitude is on the other side of the antimeridian
//     if (previousLng !== null && Math.abs(previousLng - lng) > 180) {
//       // If the current line is not empty, push it to the divided coordinates
//       if (currentLine.length) {
//         // Add a point on the antimeridian to the current line
//         currentLine.push([previousLng > 0 ? 180 : -180, lat])

//         // Push the current line to the divided coordinates
//         dividedCoordinates.push(currentLine)

//         // Start the next line with the antimeridian point
//         currentLine = [[previousLng > 0 ? -180 : 180, lat]]
//       }
//     }

//     currentLine.push([lng, lat])
//     previousLng = lng
//   }

//   // Push the last line to the divided coordinates
//   dividedCoordinates.push(currentLine)

/**
 * Converts an array of bounding boxes into a GeoJSON MultiPolygon
 * @param {Array} boxes - An array of strings in the format ["swLon swLat neLon neLat"]
 * @returns {Object} GeoJSON MultiPolygon object
 */
const convertBoxesToGeoJson = (boxes) => {
  const multiPolygonCoordinates = boxes.map((box) => {
    // Split the box string into individual coordinates
    const [swLat, swLon, neLat, neLon] = box.split(' ').map((coord) => parseFloat(coord))

    // Construct the polygon coordinates (closing the polygon by repeating the first point)
    return [
      [swLon, swLat], // Southwest corner
      [swLon, neLat], // Northwest corner
      [neLon, neLat], // Northeast corner
      [neLon, swLat], // Southeast corner
      [swLon, swLat] // Close the polygon
    ]
  })

  // Return the GeoJSON MultiPolygon object
  return {
    type: 'MultiPolygon',
    coordinates: multiPolygonCoordinates
  }
}

/**
 * Converts an array of points boxes into a GeoJSON MultiPolygon
 * @param {Array} boxes - An array of strings in the format ["swLon swLat neLon neLat"]
 * @returns {Object} GeoJSON MultiPolygon object
 */
const convertPointsToGeoJson = (points) => {
  const multiPoints = []
  points.forEach((point) => {
    // `points` is an array of strings that looks like this:
    // ["lat lng"]
    // These points are [lng, lat]
    // We need to convert it to be an array of coordinates
    // that looks li\ke this:
    // [lng, lat]
    const pointCoordinates = point.split(' ').reverse().map((coord) => parseFloat(coord))
    console.log('🚀 ~ file: normalizeCollectionSpatial.js:166 ~ pointCoordinates:', pointCoordinates)

    multiPoints.push([pointCoordinates])
  })

  return {
    type: 'MultiPoint',
    coordinates: multiPoints
  }
}

// Normalize granule spatial (boxes, lines, points, polygons) to polygons for simplified handling on the map
const normalizeCollectionSpatial = (collection) => {
  const {
    boxes,
    lines,
    points,
    polygons
  } = collection
  console.log('🚀 ~ file: normalizeCollectionSpatial.js:127 ~ collection:', collection)

  // If the collection has a box, return a MultiPolygon
  if (boxes) {
    const boxesGeoJson = convertBoxesToGeoJson(boxes)

    const response = {
      type: 'Feature',
      geometry: boxesGeoJson
    }
    // Return the bounding box as GeoJSON MultiPolygon
    console.log('🚀 ~ file: normalizeCollectionSpatial.js:117 ~ response:', response)

    return response
  }

  //  If the granule has a line, return a GeoJSON MultiLineString
  if (lines) {
    // Debugger
    console.log('🚀 ~ file: normalizeCollectionSpatial.js:117 ~ lines:', lines)
    const multipleLines = []
    lines.forEach((line) => {
      // `lines` is an array of strings that looks like this:
      // ["47.2048 -122.4496 47.1738 -122.4015 29.5579 -95.1636 29.5856 -95.1642"]
      // These points are [lon1, lat1, lon2, lat2, lon3, lat3, lon4, lat4]
      // We need to convert it to be an array of arrays of coordinates
      // that looks like this:
      // [[-122.4496, 47.2048], [-122.4015, 47.1738], [-95.1636, 29.5579], [-95.1642, 29.5856]]

      // Divide the line to handle antimeridian crossing
      // const dividedCoordinates = divideLine(line)
      const dividedCoordinates = divideLine(line)
      multipleLines.push(...dividedCoordinates)

      // MultipleLines.push(...dividedCoordinates)
    })

    console.log('🚀 ~ file: normalizeCollectionSpatial.js:157 ~ multipleLines:', multipleLines)
    // Return the line as GeoJSON MultiLineString

    const json = {
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: multipleLines
      }
    }

    // Get the number of points in the line
    // const numPoints = json.geometry.coordinates.reduce((acc, line) => acc + line.length, 0)

    // // If the line has more than mapPointsSimplifyThreshold points, simplify it to improve rendering permormance on the map
    // if (numPoints > mapPointsSimplifyThreshold) {
    //   return simplify(json, {
    //     tolerance: 0.001,
    //     highQuality: true
    //   })
    // }

    return json
  }

  // If the collection has a point, return a GeoJSON MultiPoint
  // TODO are points maybe too small?
  if (points) {
    const pointsCoordinates = convertPointsToGeoJson(points)
    console.log('🚀 ~ file: normalizeCollectionSpatial.js:186 ~ pointsCoordinates:', pointsCoordinates)

    // Return the point as GeoJSON MultiPoint
    const response = {
      type: 'Feature',
      geometry: pointsCoordinates
    }
    console.log('🚀 ~ file: normalizeCollectionSpatial.js:193 ~ response:', response)

    return response
  }

  // If the granule has a polygon, return a GeoJSON MultiPolygon
  if (polygons) {
    let multiPolygons
    polygons.forEach((polygon) => {
      polygon.forEach((shape) => {
        console.log('🚀 ~ file: normalizeCollectionSpatial.js:187 ~ shape:', shape)
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
        console.log('🚀 ~ file: normalizeCollectionSpatial.js:223 ~ dividedCoordinates:', dividedCoordinates)

        // DividedCoordinates.forEach((p) => {
        //   console.log('🚀 ~ file: normalizeCollectionSpatial.js:226 ~ p:', p)
        //   if (p.length < 3) return

        //   const interpolatedPolygon = interpolatePolygon(p)
        //   console.log('🚀 ~ file: normalizeCollectionSpatial.js:228 ~ interpolatedPolygon:', interpolatedPolygon)
        //   // MultiPolygons.push(interpolatedPolygon)
        // })

        const output = dividedCoordinates.map((pol) => {
          const normalizedPolygon = pol.map((coordinate) => [coordinate.lng, coordinate.lat])
          console.log('🚀 ~ file: normalizeCollectionSpatial.js:236 ~ normalizedPolygon:', normalizedPolygon)

          return normalizedPolygon
        })
        console.log('🚀 ~ file: normalizeCollectionSpatial.js:240 ~ output:', output)

        console.log('🚀 ~ file: normalizeCollectionSpatial.js:233 ~ coordinates:', coordinates)
        multiPolygons = output
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

export default normalizeCollectionSpatial
