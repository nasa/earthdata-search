import { castArray } from 'lodash'

const degrees = (degrees) => {
  if (degrees % 1 !== 0) {
    return `${degrees}\xB0`
  }
  return `${parseFloat(degrees).toFixed(1)}\xB0`
}

export const buildSpatial = (json) => {
  const { spatialExtent } = json

  if (!spatialExtent) return undefined

  const spatialList = []

  const { horizontalSpatialDomain } = spatialExtent
  if (horizontalSpatialDomain) {
    const { geometry } = horizontalSpatialDomain

    if (geometry.points) {
      const points = castArray(geometry.points)

      points.forEach((point) => {
        const { latitude, longitude } = point

        spatialList.push(`Point: (${degrees(latitude)}, ${degrees(longitude)})`)
      })
    } else if (geometry.boundingRectangles) {
      const boxes = castArray(geometry.boundingRectangles)

      boxes.forEach((box) => {
        const north = box.northBoundingCoordinate
        const south = box.southBoundingCoordinate
        const east = box.eastBoundingCoordinate
        const west = box.westBoundingCoordinate

        spatialList.push(`Bounding Rectangle: (${degrees(north)}, ${degrees(west)}, ${degrees(south)}, ${degrees(east)})`)
      })
    } else if (geometry.gPolygons) {
      const polygons = castArray(geometry.gPolygons)
      let string = 'Polygon: ('

      polygons.forEach((polygon) => {
        const points = castArray(polygon.boundary.points)

        points.forEach((point, i) => {
          const { latitude, longitude } = point

          string += `(${degrees(latitude)}, ${degrees(longitude)})${i + 1 < points.length ? ', ' : ''}`
        })

        string += ')'

        spatialList.push(string)
      })
    } else if (geometry.Lines) {
      const lines = castArray(geometry.Lines)

      lines.forEach((line) => {
        const latitude1 = line.points[0].latitude
        const longitude1 = line.points[0].longitude
        const latitude2 = line.points[1].latitude
        const longitude2 = line.points[1].longitude

        spatialList.push(`Line: ((${degrees(latitude1)}, ${degrees(longitude1)}), (${degrees(latitude2)}, ${degrees(longitude2)}))`)
      })
    } else {
      spatialList.push('Not Available')
    }
  } else {
    spatialList.push('Not Available')
  }

  return spatialList
}

export default buildSpatial
