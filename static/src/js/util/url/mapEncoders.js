import { isEmpty } from 'lodash'

import projections from '../map/projections'

const projectionList = [
  projections.arctic,
  projections.geographic,
  projections.antarctic
]

/**
 * Encodes a Map object into a string
 * @param {Object} query Map object with query and state
 * @return {String} A `!` delimited string of the map values
 */
export const encodeMap = (map, mapPreferences) => {
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

  // home is used to determine if the map values need to be present in the URL
  let home = '0!0!2!1!0!0,2'

  // If map preferences exist, encode them to use as the `home` location
  if (!isEmpty(mapPreferences)) {
    const {
      baseLayer,
      latitude: latitudePreference,
      longitude: longitudePreference,
      projection,
      overlayLayers,
      zoom: zoomPreference
    } = mapPreferences

    const encodedProjectionPreference = projectionList.indexOf(projection)

    let encodedBasePreference
    if (baseLayer === 'blueMarble') encodedBasePreference = 0
    if (baseLayer === 'trueColor') encodedBasePreference = 1
    if (baseLayer === 'landWaterMap') encodedBasePreference = 2

    const encodedOverlaysPreference = []
    if (overlayLayers.includes('referenceFeatures')) encodedOverlaysPreference.push(0)
    if (overlayLayers.includes('coastlines')) encodedOverlaysPreference.push(1)
    if (overlayLayers.includes('referenceLabels')) encodedOverlaysPreference.push(2)

    home = [
      latitudePreference,
      longitudePreference,
      zoomPreference,
      encodedProjectionPreference,
      encodedBasePreference,
      encodedOverlaysPreference.join(',')
    ].join('!')
  }

  // If the encoded map values match the `home` location, return an empty object
  // to prevent the values being written to the url
  if (encodedString === home) return {}

  return {
    m: encodedString
  }
}

/**
 * Decodes a map parameter string into an object
 * @param {Object} params URL parameter object from parsing the URL parameter string
 * @return {Object} Map object with query and state
 */
export const decodeMap = (params) => {
  const { m: mParam } = params
  if (!mParam) {
    return {}
  }

  const [latitude, longitude, zoom, projection, base, overlays] = mParam.split('!')

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
