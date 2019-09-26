import { castArray } from 'lodash'

const degrees = (degrees) => {
  if (degrees % 1 !== 0) {
    return `${degrees}\xB0`
  }
  return `${parseFloat(degrees).toFixed(1)}\xB0`
}

export const buildSpatial = (ummJson) => {
  const spatial = ummJson.SpatialExtent

  if (!spatial) return undefined

  const spatialList = []

  if (spatial.HorizontalSpatialDomain) {
    const geometry = spatial.HorizontalSpatialDomain.Geometry

    if (geometry.Points) {
      const points = castArray(geometry.Points)

      points.forEach((point) => {
        const latitude = point.Latitude
        const longitude = point.Longitude

        spatialList.push(`Point: (${degrees(latitude)}, ${degrees(longitude)})`)
      })
    } else if (geometry.BoundingRectangles) {
      const boxes = castArray(geometry.BoundingRectangles)

      boxes.forEach((box) => {
        const north = box.NorthBoundingCoordinate
        const south = box.SouthBoundingCoordinate
        const east = box.EastBoundingCoordinate
        const west = box.WestBoundingCoordinate

        spatialList.push(`Bounding Rectangle: (${degrees(north)}, ${degrees(west)}, ${degrees(south)}, ${degrees(east)})`)
      })
    } else if (geometry.GPolygons) {
      const polygons = castArray(geometry.GPolygons)
      let string = 'Polygon: ('

      polygons.forEach((polygon) => {
        const points = castArray(polygon.Boundary.Points)

        points.forEach((point, i) => {
          const latitude = point.Latitude
          const longitude = point.Longitude

          string += `(${degrees(latitude)}, ${degrees(longitude)})${i + 1 < points.length ? ', ' : ''}`
        })

        string += ')'

        spatialList.push(string)
      })
    } else if (geometry.Lines) {
      const lines = castArray(geometry.Lines)

      lines.forEach((line) => {
        const latitude1 = line.points[0].Latitude
        const longitude1 = line.points[0].Longitude
        const latitude2 = line.points[1].Latitude
        const longitude2 = line.points[1].Longitude

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
