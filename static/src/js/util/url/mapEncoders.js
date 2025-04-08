import { isEmpty } from 'lodash-es'
import mapLayers from '../../constants/mapLayers'
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
    rotation,
    zoom
  } = map
  const encodedProjection = projectionList[projection]

  let encodedBase
  if (base?.worldImagery) encodedBase = mapLayers.worldImagery
  if (base?.trueColor) encodedBase = mapLayers.trueColor
  if (base?.landWaterMap) encodedBase = mapLayers.landWaterMap

  const encodedOverlays = []
  if (overlays?.bordersRoads) encodedOverlays.push(mapLayers.bordersRoads)
  if (overlays?.coastlines) encodedOverlays.push(mapLayers.coastlines)
  if (overlays?.placeLabels) encodedOverlays.push(mapLayers.placeLabels)

  const encodedObj = {
    base: encodedBase,
    lat: latitude,
    long: longitude,
    overlays: encodedOverlays.join(','),
    projection: encodedProjection,
    rotation,
    zoom
  }

  // Home is used to determine if the map values need to be present in the URL
  let defaultValues = {
    base: mapLayers.worldImagery,
    lat: 0,
    long: 0,
    overlays: [mapLayers.bordersRoads, mapLayers.placeLabels].join(','),
    projection: 'EPSG:4326',
    rotation: 0,
    zoom: 3
  }

  // If map preferences exist, encode them to use as the `defaultValues` location
  if (!isEmpty(mapPreferences)) {
    const {
      baseLayer,
      latitude: latitudePreference,
      longitude: longitudePreference,
      overlayLayers,
      projection: mapProjection,
      rotation: rotationPreference = 0, // We don't currently expose rotation as a preference
      zoom: zoomPreference
    } = mapPreferences

    const encodedProjectionPreference = projectionList[mapProjection]
    const encodedBasePreference = baseLayer
    const encodedOverlaysPreference = overlayLayers

    defaultValues = {
      base: encodedBasePreference,
      lat: latitudePreference,
      long: longitudePreference,
      overlays: encodedOverlaysPreference.join(','),
      projection: encodedProjectionPreference,
      rotation: rotationPreference,
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
    rotation: rotationParam,
    zoom: zoomParam
  } = params

  if (
    !mParam
    && !baseParam
    && !latParam
    && !longParam
    && !overlaysParam
    && !projectionParam
    && !rotationParam
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
  let decodedRotation

  // If a value for lat, long, or zoom is not a valid float, NaN will be returned
  // and a default value will be used
  if (latParam && !Number.isNaN(parseFloat(latParam))) decodedLatitude = parseFloat(latParam)
  if (longParam && !Number.isNaN(parseFloat(longParam))) decodedLongitude = parseFloat(longParam)
  if (zoomParam && !Number.isNaN(parseFloat(zoomParam))) decodedZoom = parseFloat(zoomParam)
  if (rotationParam && !Number.isNaN(parseFloat(rotationParam))) {
    decodedRotation = parseFloat(rotationParam)
  }

  // If a valid projection is used, convert the value to the format the state expects
  if (projectionParam && validateProjection(projectionParam)) {
    decodedProjection = projectionParam.replace(':', '').toLowerCase()
  }

  // If a base layer is set, convert the value to the format the state expects
  if (baseParam) {
    decodedBase = {
      worldImagery: baseParam === mapLayers.worldImagery,
      trueColor: baseParam === mapLayers.trueColor,
      landWaterMap: baseParam === mapLayers.landWaterMap
    }

    const { trueColor, landWaterMap } = decodedBase

    if (!trueColor && !landWaterMap) decodedBase.worldImagery = true
  }

  // If a overlay layers are set, convert the value to the format the state expects
  if (overlaysParam) {
    decodedOverlays = {
      bordersRoads: overlaysParam.split(',').indexOf(mapLayers.bordersRoads) !== -1,
      coastlines: overlaysParam.split(',').indexOf(mapLayers.coastlines) !== -1,
      placeLabels: overlaysParam.split(',').indexOf(mapLayers.placeLabels) !== -1
    }
  }

  // Values that are not set will return undefined and will not be set in the state
  return {
    base: decodedBase,
    latitude: decodedLatitude,
    longitude: decodedLongitude,
    overlays: decodedOverlays,
    projection: decodedProjection,
    rotation: decodedRotation,
    zoom: decodedZoom
  }
}
