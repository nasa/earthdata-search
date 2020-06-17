import { encodeTemporal, decodeTemporal } from './temporalEncoders'

/**
 * Encodes a granule filters object into an object.
 * @param {Object} granuleFilters - The granule filters object.
 * @return {String} An object with encoded granule filters.
 */
export const encodeGranuleFilters = (granuleFilters) => {
  const pg = {}
  if (granuleFilters.temporal) pg.qt = encodeTemporal(granuleFilters.temporal)
  if (granuleFilters.dayNightFlag) pg.dnf = granuleFilters.dayNightFlag
  if (granuleFilters.browseOnly) pg.bo = granuleFilters.browseOnly
  if (granuleFilters.onlineOnly) pg.oo = granuleFilters.onlineOnly
  if (granuleFilters.cloudCover) pg.cc = granuleFilters.cloudCover
  if (granuleFilters.orbitNumber) pg.on = granuleFilters.orbitNumber
  if (granuleFilters.equatorCrossingLongitude) pg.ecl = granuleFilters.equatorCrossingLongitude
  if (granuleFilters.readableGranuleName) pg.id = granuleFilters.readableGranuleName.join('!')
  if (granuleFilters.equatorCrossingDate) {
    pg.ecd = encodeTemporal(granuleFilters.equatorCrossingDate)
  }
  if (granuleFilters.sortKey) pg.gsk = granuleFilters.sortKey

  return pg
}

/**
 * Decodes part of the decoded ?pg url parameter into a granule filters object
 * @param {Object} params - URL parameter object from parsing the URL parameter string
 * @return {Object} A granule filters object
 */
export const decodeGranuleFilters = (params = {}) => {
  const granuleFilters = {}
  if (params.qt) granuleFilters.temporal = decodeTemporal(params.qt)
  if (params.dnf) granuleFilters.dayNightFlag = params.dnf
  if (params.bo) granuleFilters.browseOnly = params.bo === 'true'
  if (params.oo) granuleFilters.onlineOnly = params.oo === 'true'
  if (params.cc) granuleFilters.cloudCover = params.cc
  if (params.on) granuleFilters.orbitNumber = params.on
  if (params.ecl) granuleFilters.equatorCrossingLongitude = params.ecl
  if (params.id) granuleFilters.readableGranuleName = params.id.split('!')
  if (params.ecd) granuleFilters.equatorCrossingDate = decodeTemporal(params.ecd)
  if (params.gsk) granuleFilters.sortKey = params.gsk

  return granuleFilters
}
