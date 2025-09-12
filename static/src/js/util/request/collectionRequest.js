import CmrRequest from './cmrRequest'
import { getEarthdataConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'

import { collectionRequestPermittedCmrKeys } from '../../../../../sharedConstants/permittedCmrKeys'
import {
  collectionRequestNonIndexedCmrKeys
} from '../../../../../sharedConstants/nonIndexedCmrKeys'

import { transformCollectionEntries } from '../collections/transformCollectionEntries'

/**
 * Base Request object for collection specific requests
 */
export default class CollectionRequest extends CmrRequest {
  constructor(authToken, earthdataEnvironment) {
    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost, earthdataEnvironment)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'collections'
    } else {
      super(getEarthdataConfig(earthdataEnvironment).cmrHost, earthdataEnvironment)

      // We do not define an extension here. It will be added in the search method.
      this.searchPath = 'search/collections.json'
    }
  }

  permittedCmrKeys() {
    return collectionRequestPermittedCmrKeys
  }

  nonIndexedKeys() {
    return collectionRequestNonIndexedCmrKeys
  }

  search(params) {
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
  transformResponse(data) {
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
      const { feed = {} } = data;

      ({ entry = [] } = feed)
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
