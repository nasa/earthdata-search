import projectionCodes from '../../constants/projectionCodes'

/**
 * Decode the deprecated map parameter
 * @param {Object} param The value from the m param
 * @return {Object} An object representing the map state
 */
export const decodeDeprecatedMapParam = (param) => {
  const [
    latitudeFromMParam,
    longitudeFromMParam,
    zoomFromMParam,
    projectionFromMParam,
    baseFromMParam,
    overlaysFromMParam
  ] = param.split('!')

  const decodedLatitudeFromMParam = parseFloat(latitudeFromMParam)
  const decodedLongitudeFromMParam = parseFloat(longitudeFromMParam)
  const decodedZoomFromMParam = parseFloat(zoomFromMParam)

  const formattedProjectionList = [
    projectionCodes.arctic,
    projectionCodes.geographic,
    projectionCodes.antarctic
  ]

  const decodedProjectionFromMParam = formattedProjectionList[projectionFromMParam]

  let decodedBaseFromMParam
  if (baseFromMParam) {
    decodedBaseFromMParam = {
      worldImagery: baseFromMParam === '0',
      trueColor: baseFromMParam === '1',
      landWaterMap: baseFromMParam === '2'
    }
  }

  let decodedOverlaysFromMParam
  if (overlaysFromMParam) {
    decodedOverlaysFromMParam = {
      bordersRoads: overlaysFromMParam.split(',').indexOf('0') !== -1,
      coastlines: overlaysFromMParam.split(',').indexOf('1') !== -1,
      placeLabels: overlaysFromMParam.split(',').indexOf('2') !== -1
    }
  }

  return {
    base: decodedBaseFromMParam,
    latitude: decodedLatitudeFromMParam,
    longitude: decodedLongitudeFromMParam,
    overlays: decodedOverlaysFromMParam,
    projection: decodedProjectionFromMParam,
    zoom: decodedZoomFromMParam
  }
}
