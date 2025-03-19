import { castArray } from 'lodash-es'

const degrees = (value) => {
  if (value % 1 !== 0) {
    return `${value}\xB0`
  }

  return `${parseFloat(value).toFixed(1)}\xB0`
}

// TODO why don't we do anything with the horizontal spatial domain
export const buildSpatial = (json) => {
  const { spatialExtent } = json
  console.log('🚀 ~ file: spatial.js:13 ~ spatialExtent:', spatialExtent)

  if (!spatialExtent) return undefined

  const spatialList = []

  const { horizontalSpatialDomain } = spatialExtent
  if (horizontalSpatialDomain) {
    const { geometry } = horizontalSpatialDomain
    console.log('🚀 ~ file: spatial.js:23 ~ geometry:', geometry)

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
    } else if (geometry.gpolygons) {
      // TODO this isn't finding polygons because the key is lowercased in the metadata
      const polygons = castArray(geometry.gpolygons)
      console.log('🚀 ~ file: spatial.js:46 ~ polygons:', polygons)
      let string = 'Polygon: ('

      polygons.forEach((polygon) => {
        const points = castArray(polygon.boundary.points)

        points.forEach((point, i) => {
          const { latitude, longitude } = point

          string += `(${degrees(latitude)}, ${degrees(longitude)})${i + 1 < points.length ? ', ' : ''}`
        })

        string += ')'

        spatialList.push(string)
        console.log('🚀 ~ file: spatial.js:60 ~ spatialList:', spatialList)
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
