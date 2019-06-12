import { buildURL } from './util/cmr/buildUrl'
import { doSearchRequest } from './util/cmr/doSearchRequest'
import { getJwtToken } from './util'

/**
 * Handler to perform an authenticated CMR Collection search
 */
export default async function collectionSearch(event) {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'facets_size',
    'format',
    'has_granules_or_cwic',
    'has_granules',
    'include_facets',
    'include_granule_counts',
    'include_has_granules',
    'include_tags',
    'instrument_h',
    'keyword',
    'line',
    'options',
    'page_num',
    'page_size',
    'platform_h',
    'point',
    'polygon',
    'processing_level_id_h',
    'project_h',
    'science_keywords_h',
    'sort_key',
    'tag_key',
    'temporal'
  ]

  const nonIndexedKeys = [
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'instrument_h',
    'platform_h',
    'processing_level_id_h',
    'project_h',
    'sort_key',
    'tag_key'
  ]

  const { body } = event

  return doSearchRequest(getJwtToken(event), buildURL({
    body,
    nonIndexedKeys,
    path: '/search/collections',
    permittedCmrKeys
  }))
}
