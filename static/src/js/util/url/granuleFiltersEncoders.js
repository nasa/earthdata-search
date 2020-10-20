import { encodeTemporal, decodeTemporal } from './temporalEncoders'
import { encodeGridCoords, decodeGridCoords } from './gridEncoders'

/**
 * Encodes a granule filters object into an object.
 * @param {Object} granuleFilters - The granule filters object.
 * @return {String} An object with encoded granule filters.
 */
export const encodeGranuleFilters = (granuleFilters) => {
  const {
    browseOnly,
    cloudCover,
    dayNightFlag,
    equatorCrossingDate,
    equatorCrossingLongitude,
    gridCoords,
    onlineOnly,
    orbitNumber,
    readableGranuleName,
    sortKey,
    temporal,
    tilingSystem
  } = granuleFilters

  const pg = {}
  if (temporal) pg.qt = encodeTemporal(temporal)
  if (dayNightFlag) pg.dnf = dayNightFlag
  if (browseOnly) pg.bo = browseOnly
  if (onlineOnly) pg.oo = onlineOnly
  if (cloudCover) pg.cc = cloudCover
  if (orbitNumber) pg.on = orbitNumber
  if (equatorCrossingLongitude) pg.ecl = equatorCrossingLongitude
  if (readableGranuleName) pg.id = encodeURIComponent(readableGranuleName.join('!'))
  if (equatorCrossingDate) {
    pg.ecd = encodeTemporal(granuleFilters.equatorCrossingDate)
  }
  if (sortKey) pg.gsk = sortKey
  if (tilingSystem) {
    pg.ts = tilingSystem

    if (gridCoords) pg.gc = encodeGridCoords(gridCoords)
  }

  return pg
}

/**
 * Decodes part of the decoded ?pg url parameter into a granule filters object
 * @param {Object} params - URL parameter object from parsing the URL parameter string
 * @return {Object} A granule filters object
 */
export const decodeGranuleFilters = (params = {}) => {
  const {
    bo: browseOnly,
    cc: cloudCover,
    dnf: dayNightFlag,
    ecd: equatorCrossingDate,
    ecl: equatorCrossingLongitude,
    gc: gridCoords,
    gsk: sortKey,
    id: readableGranuleName,
    on: orbitNumber,
    oo: onlineOnly,
    qt: temporal,
    ts: tilingSystem
  } = params

  const granuleFilters = {}
  if (temporal) granuleFilters.temporal = decodeTemporal(temporal)
  if (dayNightFlag) granuleFilters.dayNightFlag = dayNightFlag
  if (browseOnly) granuleFilters.browseOnly = browseOnly === 'true'
  if (onlineOnly) granuleFilters.onlineOnly = onlineOnly === 'true'
  if (cloudCover) granuleFilters.cloudCover = cloudCover
  if (orbitNumber) granuleFilters.orbitNumber = orbitNumber
  if (equatorCrossingLongitude) granuleFilters.equatorCrossingLongitude = equatorCrossingLongitude
  if (readableGranuleName) granuleFilters.readableGranuleName = decodeURIComponent(readableGranuleName).split('!')
  if (equatorCrossingDate) granuleFilters.equatorCrossingDate = decodeTemporal(equatorCrossingDate)
  if (sortKey) granuleFilters.sortKey = sortKey

  if (tilingSystem) {
    granuleFilters.tilingSystem = tilingSystem

    if (gridCoords) granuleFilters.gridCoords = decodeGridCoords(gridCoords)
  }

  return granuleFilters
}
