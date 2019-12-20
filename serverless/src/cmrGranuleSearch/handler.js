import { pick } from 'lodash'
import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { isWarmUp } from '../util/isWarmup'
import { logLambdaEntryTime } from '../util/logging/logLambdaEntryTime'

/**
 * Perform an authenticated CMR Granule search
 * @param {Object} event Details about the HTTP request that it received
 */
const cmrGranuleSearch = async (event, context) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { body, headers } = event

  const { invocationTime, requestId } = JSON.parse(body)

  logLambdaEntryTime(requestId, invocationTime, context)

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'browse_only',
    'cloud_cover',
    'day_night_flag',
    'echo_collection_id',
    'equator_crossing_date',
    'equator_crossing_longitude',
    'exclude',
    'line',
    'online_only',
    'options',
    'orbit_number',
    'page_num',
    'page_size',
    'point',
    'polygon',
    'readable_granule_name',
    'sort_key',
    'temporal',
    'two_d_coordinate_system'
  ]

  const nonIndexedKeys = [
    'exclude',
    'readable_granule_name',
    'sort_key'
  ]

  return doSearchRequest({
    jwtToken: getJwtToken(event),
    path: '/search/granules.json',
    params: buildParams({
      body,
      permittedCmrKeys,
      nonIndexedKeys
    }),
    invocationTime,
    providedHeaders,
    requestId
  })
}

export default cmrGranuleSearch
