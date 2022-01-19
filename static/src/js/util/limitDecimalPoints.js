import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Limits a Latitude/Longitude point to a configured number of decimal places
 * @param {Array} latLng A Lat/Lng point as an array
 */
export const limitDecimalPoints = (latLng) => {
  const { defaultSpatialDecimalSize } = getApplicationConfig()
  return latLng.map((point) => Number(parseFloat(point).toFixed(defaultSpatialDecimalSize)))
}

/**
 * Limits an array of Latitude/Longitude points to a configured number of decimal places
 * @param {Array} latLngs  Array of Lat/Lng points (each point a comma delimited string)
 */
export const limitLatLngDecimalPoints = (latLngs) => latLngs.map((latLng) => {
  const points = latLng.split(',')
  return limitDecimalPoints(points).join(',')
})
