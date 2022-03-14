import projections from '../map/projections'

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
    projections.arctic,
    projections.geographic,
    projections.antarctic
  ]

  const decodedProjectionFromMParam = formattedProjectionList[projectionFromMParam]

  let decodedBaseFromMParam
  if (baseFromMParam) {
    decodedBaseFromMParam = {
      blueMarble: baseFromMParam === '0',
      trueColor: baseFromMParam === '1',
      landWaterMap: baseFromMParam === '2'
    }
  }

  let decodedOverlaysFromMParam
  if (overlaysFromMParam) {
    decodedOverlaysFromMParam = {
      referenceFeatures: overlaysFromMParam.split(',').indexOf('0') !== -1,
      coastlines: overlaysFromMParam.split(',').indexOf('1') !== -1,
      referenceLabels: overlaysFromMParam.split(',').indexOf('2') !== -1
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
