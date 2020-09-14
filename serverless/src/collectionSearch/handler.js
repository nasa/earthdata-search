import { pick } from 'lodash'
import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Perform an authenticated CMR Collection search
 * @param {Object} event Details about the HTTP request that it received
 */
const collectionSearch = async (event) => {
  const { body, headers } = event

  const { defaultResponseHeaders } = getApplicationConfig()

  const { requestId } = JSON.parse(body)

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'circle',
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'data_center',
    'echo_collection_id',
    'facets_size',
    'format',
    'granule_data_format',
    'granule_data_format_h',
    'has_granules_or_cwic',
    'has_granules',
    'include_facets',
    'include_granule_counts',
    'include_has_granules',
    'include_tags',
    'instrument',
    'instrument_h',
    'keyword',
    'line',
    'options',
    'page_num',
    'page_size',
    'platform',
    'platform_h',
    'point',
    'polygon',
    'processing_level_id_h',
    'project_h',
    'project',
    'provider',
    'science_keywords_h',
    'sort_key',
    'spatial_keyword',
    'tag_key',
    'temporal',
    'two_d_coordinate_system_name'
  ]

  const nonIndexedKeys = [
    'bounding_box',
    'circle',
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'granule_data_format_h',
    'granule_data_format',
    'instrument_h',
    'instrument',
    'line',
    'platform_h',
    'platform',
    'point',
    'polygon',
    'processing_level_id_h',
    'project_h',
    'provider',
    'sort_key',
    'spatial_keyword',
    'tag_key',
    'two_d_coordinate_system_name'
  ]

  try {
    return doSearchRequest({
      jwtToken: getJwtToken(event),
      path: '/search/collections.json',
      params: buildParams({
        body,
        nonIndexedKeys,
        permittedCmrKeys
      }),
      providedHeaders,
      requestId
    })
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default collectionSearch
