import { isEmpty } from 'lodash-es'

import CmrRequest from './cmrRequest'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { transformCollectionEntries } from '../collections/transformCollectionEntries'
import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'

/**
 * Request object for NLP search requests to CMR
 * Calls CMR NLP endpoint directly
 */
export default class NlpSearchRequest extends CmrRequest {
  constructor(earthdataEnvironment) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

    this.searchPath = 'search/nlp/query.json'
  }

  transformData(data) {
    return prepKeysForCmr(
      data,
      this.nonIndexedKeys()
    )
  }

  search(searchParams) {
    return this.post(this.searchPath, searchParams)
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return {Array} An empty array
   */
  nonIndexedKeys() {
    return [
      'search_params'
    ]
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} Array of permitted CMR keys for NLP search
   */
  permittedCmrKeys() {
    return [
      'embedding',
      'q',
      'search_params'
    ]
  }

  /**
   * Transforms the NLP search response to extract and format spatial/temporal data
   * @param {Object} data - Response object from the object.
   * @return {Object} The transformed response object
   */
  transformResponse(data) {
    const {
      metadata,
      queryInfo = {}
    } = data || {}

    if (isEmpty(queryInfo)) {
      return {
        metadata,
        queryInfo: {
          keyword: null,
          spatial: {},
          temporal: {}
        }
      }
    }

    const {
      keyword,
      spatial,
      temporal
    } = queryInfo

    // Transform metadata entries into collection items
    const { feed } = metadata
    const { entry } = feed
    const transformedEntries = transformCollectionEntries(entry, this.earthdataEnvironment)

    return {
      queryInfo: {
        keyword,
        spatial: spatial || {},
        temporal: temporal || {}
      },
      metadata: {
        feed: {
          ...feed,
          entry: transformedEntries
        }
      }
    }
  }
}
