import Request from './request'

/**
 * Base Request object for collection specific requests
 */
export default class CollectionRequest extends Request {
  constructor(authToken) {
    if (authToken && authToken !== '') {
      super('http://localhost:3001')

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'collections'
    } else {
      super('https://cmr.earthdata.nasa.gov')

      this.searchPath = 'search/collections.json'
    }
  }

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
    this.handleUnauthorized(data)

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { statusCode = 200 } = data
    if (statusCode !== 200) return data

    const { feed } = data
    const { entry } = feed

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
