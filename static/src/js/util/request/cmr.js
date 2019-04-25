import { prepKeysForCmr } from '../url/url'
import Request from './request'

export class CmrRequest extends Request {
  baseUrl() {
    return 'http://cmr.earthdata.nasa.gov'
  }

  /**
   * Select only permitted keys and transform them to meet the requirements of CMR.
   * @param {Object} data - An object containing any keys.
   * @return {Object} An object containing only the desired keys.
   */
  transformRequest(data) {
    const cmrData = prepKeysForCmr(data, this.nonIndexedKeys())

    return cmrData
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

  search(params) {
    return super.post('search/collections.json', params)
  }
}

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

      const h = 170
      const w = 170

      if (granule.id) {
        // eslint-disable-next-line
        updatedGranule.thumbnail = `https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/${granule.id}?h=${h}&w=${w}`
      }

      return updatedGranule
    })

    return {
      feed: {
        entry
      }
    }
  }


  search(params) {
    return super.post('search/granules.json', params)
  }
}

export class TimelineRequest extends CmrRequest {
  permittedCmrKeys() {
    return [
      'echo_collection_id',
      'end_date',
      'interval',
      'start_date'
    ]
  }

  search(params) {
    return super.post('search/granules/timeline.json', params)
  }
}
