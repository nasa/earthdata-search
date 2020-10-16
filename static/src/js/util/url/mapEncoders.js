import projections from '../map/projections'

const projectionList = [
  projections.arctic,
  projections.geographic,
  projections.antarctic
]

/**
 * Encodes a Map object into a string
 * @param {object} query Map object with query and state
 * @return {string} A `!` delimited string of the map values
 */
export const encodeMap = (map) => {
  if (!map) return ''

  const {
    base,
    latitude,
    longitude,
    overlays,
    projection,
    zoom
  } = map

  const encodedProjection = projectionList.indexOf(projection)

  let encodedBase
  if (base.blueMarble) encodedBase = 0
  if (base.trueColor) encodedBase = 1
  if (base.landWaterMap) encodedBase = 2

  const encodedOverlays = []
  if (overlays.referenceFeatures) encodedOverlays.push(0)
  if (overlays.coastlines) encodedOverlays.push(1)
  if (overlays.referenceLabels) encodedOverlays.push(2)

  const encodedString = [
    latitude,
    longitude,
    zoom,
    encodedProjection,
    encodedBase,
    encodedOverlays.join(',')
  ].join('!')

  if (encodedString === '0!0!2!1!0!0,2') return ''

  return encodedString
}

/**
 * Decodes a map parameter string into an object
 * @param {string} string A `!` delimited string of the map values
 * @return {object} Map object with query and state
 */
export const decodeMap = (string) => {
  if (!string) {
    return {}
  }

  const [latitude, longitude, zoom, projection, base, overlays] = string.split('!')

  const decodedLatitude = parseFloat(latitude)
  const decodedLongitude = parseFloat(longitude)
  const decodedZoom = parseFloat(zoom)

  const decodedProjection = projectionList[projection]

  const decodedBase = {
    blueMarble: base === '0',
    trueColor: base === '1',
    landWaterMap: base === '2'
  }

  const decodedOverlays = {
    referenceFeatures: overlays.split(',').indexOf('0') !== -1,
    coastlines: overlays.split(',').indexOf('1') !== -1,
    referenceLabels: overlays.split(',').indexOf('2') !== -1
  }

  const map = {
    base: decodedBase,
    latitude: decodedLatitude,
    longitude: decodedLongitude,
    overlays: decodedOverlays,
    projection: decodedProjection,
    zoom: decodedZoom
  }

  return {
    ...map
  }
}
