import { encodeTemporal, decodeTemporal } from './temporalEncoders'

/**
 * Encodes a granule filters object into an object.
 * @param {object} granuleFilters - The granule filters object.
 * @return {string} An object with encoded granule filters.
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

  return pg
}

/**
 * Decodes part of the decoded ?pg url parameter into a granule filters object
 * @param {object} params - URL parameter object from parsing the URL parameter string
 * @return {object} A granule filters object
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

  return granuleFilters
}
