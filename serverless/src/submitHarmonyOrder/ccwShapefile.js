import { isClockwiseLatLng } from '../util/granules'

/**
 * Returns the given shapefile, ensuring all polygons are in CCW order
 * @param {Object} shapefile GeoJson shapefile
 */
export const ccwShapefile = (shapefile) => {
  const { features } = shapefile

  return {
    ...shapefile,
    features: features.map((feature) => {
      const { geometry } = feature
      const { coordinates, type } = geometry

      const latLngCoordinates = coordinates[0].map((coordinate) => (
        {
          lng: coordinate[0],
          lat: coordinate[1]
        }
      ))

      if (type === 'Polygon' && isClockwiseLatLng(latLngCoordinates)) {
        return {
          ...feature,
          geometry: {
            ...geometry,
            coordinates: [coordinates[0].reverse()]
          }
        }
      }

      return feature
    })
  }
}
