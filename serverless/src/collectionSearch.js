import { buildURL, doSearchRequest } from './util'


export default async function collectionSearch(event) {
  const { body, requestContext } = event
  const { jwtToken } = requestContext.authorizer

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'collection_data_type',
    'concept_id',
    'data_center_h',
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
    'data_center_h',
    'instrument_h',
    'platform_h',
    'processing_level_id_h',
    'project_h',
    'sort_key',
    'tag_key'
  ]

  return doSearchRequest(jwtToken, buildURL({
    body,
    nonIndexedKeys,
    path: '/search/collections.json',
    permittedCmrKeys
  }))
}
