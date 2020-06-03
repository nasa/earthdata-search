import { castArray } from 'lodash'

const degrees = (degrees) => {
  if (degrees % 1 !== 0) {
    return `${degrees}\xB0`
  }
  return `${parseFloat(degrees).toFixed(1)}\xB0`
}

export const buildSpatial = (ummJson) => {
  const spatial = ummJson.spatial_extent

  if (!spatial) return undefined

  const spatialList = []

  if (spatial.horizontal_spatial_domain) {
    const { horizontal_spatial_domain: horizontalSpatialDomain } = spatial
    const { geometry } = horizontalSpatialDomain

    if (geometry.Points) {
      const points = castArray(geometry.Points)

      points.forEach((point) => {
        const { latitude, longitude } = point

        spatialList.push(`Point: (${degrees(latitude)}, ${degrees(longitude)})`)
      })
    } else if (geometry.bounding_rectangles) {
      const boxes = castArray(geometry.bounding_rectangles)

      boxes.forEach((box) => {
        const north = box.north_bounding_coordinate
        const south = box.south_bounding_coordinate
        const east = box.east_bounding_coordinate
        const west = box.west_bounding_coordinate

        spatialList.push(`Bounding Rectangle: (${degrees(north)}, ${degrees(west)}, ${degrees(south)}, ${degrees(east)})`)
      })
    } else if (geometry.g_polygons) {
      const polygons = castArray(geometry.g_polygons)
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
