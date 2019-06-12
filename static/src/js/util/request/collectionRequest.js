import Request from './request'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Base Request object for collection specific requests
 */
export default class CollectionRequest extends Request {
  constructor(authToken) {
    if (authToken && authToken !== '') {
      super(getEarthdataConfig('prod').apiHost)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'collections'
    } else {
      super(getEarthdataConfig('prod').cmrHost)

      // We do not define an extension here. It will be added in the search method.
      this.searchPath = 'search/collections'
    }
  }

  permittedCmrKeys(ext) {
    if (ext === 'umm_json') {
      return [
        'concept_id'
      ]
    }
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
      'concept_id',
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
    super.transformResponse(data)

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { statusCode = 200 } = data
    if (statusCode !== 200) return data

    let entry

    if (data.items) {
      entry = data.items
    } else {
      const { feed } = data
      // eslint-disable-next-line prefer-destructuring
      entry = feed.entry
    }

    entry.map((collection) => {
      const transformedCollection = collection

      if (collection && collection.tags) {
        transformedCollection.is_cwic = Object.keys(collection.tags).includes('org.ceos.wgiss.cwic.granules.prod')
          && collection.has_granules === false
      }

      return transformedCollection
    })

    return data
  }
}
