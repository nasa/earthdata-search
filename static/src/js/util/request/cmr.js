import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'
import { prepKeysForCmr } from '../url/url'
import Request from './request'
import { getTemporal } from '../edsc-date'

/**
 * Top level CMR request object that contains all the most generic transformations and settings
 */
export class CmrRequest extends Request {
  /**
   * Constructor.
   */
  constructor() {
    super('https://cmr.earthdata.nasa.gov')
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return []
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return {Array} An empty array
   */
  nonIndexedKeys() {
    return []
  }

  /**
   * Select only permitted keys and transform them to meet the requirements of CMR.
   * @param {Object} data - An object containing any keys.
   * @return {Object} An object containing only the desired keys.
   */
  transformRequest(data) {
    const cmrData = super.transformRequest(data)

    // Converts javascript compliant keys to snake cased keys for use
    // in URLs and request payloads
    const snakeKeyData = snakeCaseKeys(cmrData)

    // Prevent keys that our external services don't support from being sent
    const filteredData = pick(snakeKeyData, this.permittedCmrKeys())

    const result = prepKeysForCmr(filteredData, this.nonIndexedKeys())

    return result
  }
}

/**
 * Request object for collection specific requests
 */
export class CollectionRequest extends CmrRequest {
  permittedCmrKeys() {
    return [
      'bounding_box',
      'collection_data_type',
      'concept_id',
      'data_center_h',
      'format',
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

  /*
   * Makes a POST request to CMR
   */
  search(params) {
    return super.post('search/collections.json', params)
  }
}

/**
 * Request object for granule specific requests
 */
export class GranuleRequest extends CmrRequest {
  permittedCmrKeys() {
    return [
      'echo_collection_id',
      'page_num',
      'page_size',
      'sort_key'
    ]
  }

  nonIndexedKeys() {
    return [
      'sort_key'
    ]
  }

  transformResponse(data) {
    const { feed = {} } = data
    const { entry = [] } = feed

    entry.map((granule) => {
      const updatedGranule = granule

      updatedGranule.is_cwic = false

      updatedGranule.formatted_temporal = getTemporal(granule.time_start, granule.time_end)

      const h = 85
      const w = 85

      if (granule.id) {
        // eslint-disable-next-line
        updatedGranule.thumbnail = `${this.baseUrl}/browse-scaler/browse_images/granules/${granule.id}?h=${h}&w=${w}`
      }

      return updatedGranule
    })

    return {
      feed: {
        entry
      }
    }
  }

  /*
   * Makes a POST request to CMR
   */
  search(params) {
    return super.post('search/granules.json', params)
  }
}

/**
 * Request object for timeline specific requests
 */
export class TimelineRequest extends CmrRequest {
  permittedCmrKeys() {
    return [
      'echo_collection_id',
      'end_date',
      'interval',
      'start_date'
    ]
  }

  /*
   * Makes a POST request to CMR
   */
  search(params) {
    return super.post('search/granules/timeline.json', params)
  }
}
