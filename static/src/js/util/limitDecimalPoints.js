/**
 * Limits a Latitude/Longitude point to 5 decimal places
 * @param {Array} latLng A Lat/Lng point as an array
 */
export const limitDecimalPoints = latLng => (
  latLng.map(point => Number(parseFloat(point).toFixed(5)))
)

/**
 * Limits an array of Latitude/Longitude points to 5 decimal places
 * @param {Array} latLngs  Array of Lat/Lng points (each point a comma delimited string)
 */
export const limitLatLngDecimalPoints = latLngs => latLngs.map((latLng) => {
  const points = latLng.split(',')
  return limitDecimalPoints(points).join(',')
})
