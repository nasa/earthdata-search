import CmrRequest from './cmr'
import LambdaRequest from './lambda'
import Request from './request'

/**
 * Base Request object for collection specific requests
 */
class BaseCollectionRequest extends Request {
  permittedCmrKeys() {
    return [
      'params',
      'bounding_box',
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'format',
      'facets_size',
      'has_granules',
      'has_granules_or_cwic',
      'include_facets',
      'include_granule_counts',
      'include_has_granules',
      'include_tags',
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
  }

  nonIndexedKeys() {
    return [
      'collection_data_type',
      'data_center_h',
      'instrument_h',
      'platform_h',
      'processing_level_id_h',
      'project_h',
      'sort_key',
      'tag_key'
    ]
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the object.
   * @return {Object} The object provided
   */
  transformResponse(data) {
    const transformedData = data
    const { entry } = data.feed

    const transformedEntry = entry.map((collection) => {
      const transformedCollection = collection

      if (collection && collection.tags) {
        transformedCollection.is_cwic = Object.keys(collection.tags).includes('org.ceos.wgiss.cwic.granules.prod')
          && collection.has_granules === false
      }

      return transformedCollection
    })

    transformedData.entry = transformedEntry
    return transformedData
  }
}

/**
 * Authenticated Request object for collection specific requests
 */
class AuthenticatedCollectionRequest extends LambdaRequest {
  permittedCmrKeys = BaseCollectionRequest.prototype.permittedCmrKeys

  nonIndexedKeys = BaseCollectionRequest.prototype.nonIndexedKeys

  transformResponse = BaseCollectionRequest.prototype.transformResponse

  /*
   * Makes a POST request to Lambda
   */
  search(params) {
    return super.post('collections', params, true)
  }
}

/**
 * Unauthenticated Request object for collection specific requests
 */
class UnauthenticatedCollectionRequest extends CmrRequest {
  permittedCmrKeys = BaseCollectionRequest.prototype.permittedCmrKeys

  nonIndexedKeys = BaseCollectionRequest.prototype.nonIndexedKeys

  transformResponse = BaseCollectionRequest.prototype.transformResponse

  /*
   * Makes a POST request to CMR
   */
  search(params) {
    return super.post('search/collections.json', params)
  }
}

/**
 * Request object for collection specific requests
 */
export default class CollectionRequest {
  constructor(authenticated) {
    if (authenticated) return new AuthenticatedCollectionRequest()
    return new UnauthenticatedCollectionRequest()
  }
}
