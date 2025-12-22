import CmrRequest from './cmrRequest'
// @ts-expect-error Types are not defined for this module
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error Types are not defined for this module
import { collectionRequestPermittedCmrKeys } from '../../../../../sharedConstants/permittedCmrKeys'
import {
  collectionRequestNonIndexedCmrKeys
// @ts-expect-error Types are not defined for this module
} from '../../../../../sharedConstants/nonIndexedCmrKeys'

// @ts-expect-error Types are not defined for this module
import { transformCollectionEntries } from '../collections/transformCollectionEntries'

import type { CollectionRequestParams, CollectionResponseData } from '../../types/sharedTypes'

/**
 * Base Request object for collection specific requests
 */
export default class CollectionRequest extends CmrRequest {
  constructor(edlToken: string | null, earthdataEnvironment: string) {
    super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

    this.searchPath = 'search/collections.json'

    if (edlToken) {
      this.authenticated = true
      this.edlToken = edlToken
    }
  }

  permittedCmrKeys() {
    return collectionRequestPermittedCmrKeys
  }

  nonIndexedKeys() {
    return collectionRequestNonIndexedCmrKeys
  }

  search(params: CollectionRequestParams) {
    if (params.twoDCoordinateSystem && params.twoDCoordinateSystem.coordinates) {
      // eslint-disable-next-line no-param-reassign
      delete params.twoDCoordinateSystem.coordinates
    }

    return this.post(this.searchPath, params)
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the object.
   * @return {Object} The object provided
   */
  transformResponse(data: CollectionResponseData) {
    super.transformResponse(data)

    const { earthdataEnvironment } = this

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { errors = [] } = data
    if (errors.length > 0) return data

    if (!data || Object.keys(data).length === 0) return data

    let entry

    if (data.items) {
      entry = data.items
    } else {
      const { feed } = data

      entry = feed && 'entry' in feed ? feed.entry : []
    }

    // Transform the collection entries
    const transformedEntries = transformCollectionEntries(entry, earthdataEnvironment)

    // Create a new data object with transformed entries
    if (data.items) {
      return {
        ...data,
        items: transformedEntries
      }
    }

    return {
      ...data,
      feed: {
        ...data.feed,
        entry: transformedEntries
      }
    }
  }
}
