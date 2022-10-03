import { isEmpty } from 'lodash'

import projections from '../map/projections'
import { decodeDeprecatedMapParam } from './deprecatedEncoders'

const projectionList = {
  [projections.arctic]: 'EPSG:3413',
  [projections.geographic]: 'EPSG:4326',
  [projections.antarctic]: 'EPSG:3031'
}

/**
 * Validates the projection parameter. Handles both the "EPSG:XXXX" and "epsgXXXX" formats
 * @param {String} param The value of the projection parameter
 */
const validateProjection = (param) => Object.keys(projectionList).some(
  (projection) => projection === param.replace(':', '').toLowerCase()
)

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

  const encodedProjection = projectionList[projection]

  let encodedBase
  if (base?.blueMarble) encodedBase = 'blueMarble'
  if (base?.trueColor) encodedBase = 'trueColor'
  if (base?.landWaterMap) encodedBase = 'landWaterMap'

  const encodedOverlays = []
  if (overlays?.referenceFeatures) encodedOverlays.push('referenceFeatures')
  if (overlays?.coastlines) encodedOverlays.push('coastlines')
  if (overlays?.referenceLabels) encodedOverlays.push('referenceLabels')

  const encodedObj = {
    base: encodedBase,
    lat: latitude,
    long: longitude,
    overlays: encodedOverlays.join(','),
    projection: encodedProjection,
    zoom
  }

  // home is used to determine if the map values need to be present in the URL
  let defaultValues = {
    base: 'blueMarble',
    lat: 0,
    long: 0,
    overlays: 'referenceFeatures,referenceLabels',
    projection: 'EPSG:4326',
    zoom: 2
  }

  // If map preferences exist, encode them to use as the `defaultValues` location
  if (!isEmpty(mapPreferences)) {
    const {
      baseLayer,
      latitude: latitudePreference,
      longitude: longitudePreference,
      projection,
      overlayLayers,
      zoom: zoomPreference
    } = mapPreferences

    const encodedProjectionPreference = projectionList[projection]

    let encodedBasePreference
    if (baseLayer === 'blueMarble') encodedBasePreference = 'blueMarble'
    if (baseLayer === 'trueColor') encodedBasePreference = 'trueColor'
    if (baseLayer === 'landWaterMap') encodedBasePreference = 'landWaterMap'

    const encodedOverlaysPreference = []
    if (overlayLayers.indexOf('referenceFeatures') > -1) encodedOverlaysPreference.push('referenceFeatures')
    if (overlayLayers.indexOf('coastlines') > -1) encodedOverlaysPreference.push('coastlines')
    if (overlayLayers.indexOf('referenceLabels') > -1) encodedOverlaysPreference.push('referenceLabels')

    defaultValues = {
      base: encodedBasePreference,
      lat: latitudePreference,
      long: longitudePreference,
      overlays: encodedOverlaysPreference.join(','),
      projection: encodedProjectionPreference,
      zoom: zoomPreference
    }
  }

  // Return an object containing only the keys that do not match the default values
  return Object.fromEntries(
    Object.entries(encodedObj).filter(
      ([key, value]) => value !== defaultValues[key]
    )
  )
}

/**
 * Decodes a map parameter string into an object
 * @param {Object} params URL parameter object from parsing the URL parameter string
 * @return {Object} Map object with query and state
 */
export const decodeMap = (params) => {
  const {
    m: mParam,
    base: baseParam,
    lat: latParam,
    long: longParam,
    overlays: overlaysParam,
    projection: projectionParam,
    zoom: zoomParam
  } = params

  if (
    !mParam
    && !baseParam
    && !latParam
    && !longParam
    && !overlaysParam
    && !projectionParam
    && !zoomParam
  ) {
    // If no values are defined return an empty object, typically causing the preferences to be used.
    return {}
  }

  // Decode the deprecated 'm' parameter if it exists
  if (mParam) return decodeDeprecatedMapParam(mParam)

  let decodedLatitude
  let decodedLongitude
  let decodedZoom
  let decodedProjection
  let decodedBase
  let decodedOverlays

  // If a value for lat, long, or zoom is not a valid float, NaN will be returned
  // and a default value will be used
  if (latParam && !Number.isNaN(parseFloat(latParam))) decodedLatitude = parseFloat(latParam)
  if (longParam && !Number.isNaN(parseFloat(longParam))) decodedLongitude = parseFloat(longParam)
  if (zoomParam && !Number.isNaN(parseFloat(zoomParam))) decodedZoom = parseFloat(zoomParam)

  // If a valid projection is used, convert the value to the format the state expects
  if (projectionParam && validateProjection(projectionParam)) {
    decodedProjection = projectionParam.replace(':', '').toLowerCase()
  }

  // If a base layer is set, convert the value to the format the state expects
  if (baseParam) {
    decodedBase = {
      blueMarble: baseParam === 'blueMarble',
      trueColor: baseParam === 'trueColor',
      landWaterMap: baseParam === 'landWaterMap'
    }

    const { trueColor, landWaterMap } = decodedBase

    if (!trueColor && !landWaterMap) decodedBase.blueMarble = true
  }

  // If a overlay layers are set, convert the value to the format the state expects
  if (overlaysParam) {
    decodedOverlays = {
      referenceFeatures: overlaysParam.split(',').indexOf('referenceFeatures') !== -1,
      coastlines: overlaysParam.split(',').indexOf('coastlines') !== -1,
      referenceLabels: overlaysParam.split(',').indexOf('referenceLabels') !== -1
    }
  }

  // Values that are not set will return undefined and will not be set in the state
  return {
    base: decodedBase,
    latitude: decodedLatitude,
    longitude: decodedLongitude,
    overlays: decodedOverlays,
    projection: decodedProjection,
    zoom: decodedZoom
  }
}
