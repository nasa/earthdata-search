import camelcaseKeys from 'camelcase-keys'

import CmrRequest from './cmrRequest'
import {
  getApplicationConfig,
  getEarthdataConfig,
  getEnvironmentConfig
} from '../../../../../sharedUtils/config'

import { collectionRequestPermittedCmrKeys } from '../../../../../sharedConstants/permittedCmrKeys'
import {
  collectionRequestNonIndexedCmrKeys
} from '../../../../../sharedConstants/nonIndexedCmrKeys'

import { hasTag } from '../../../../../sharedUtils/tags'
import { isCSDACollection } from '../isCSDACollection'
import { getOpenSearchOsddLink } from '../../../../../sharedUtils/getOpenSearchOsddLink'

import unavailableImg from '../../../assets/images/image-unavailable.svg'

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

    // Iterate over the collections
    entry.map((collection) => {
      const transformedCollection = collection
      if (!transformedCollection.id && transformedCollection.conceptId) {
        transformedCollection.id = transformedCollection.conceptId
      }

      transformedCollection.conceptId = transformedCollection.id

      if (collection && (collection.tags || collection.links)) {
        transformedCollection.isOpenSearch = !!getOpenSearchOsddLink(collection)

        transformedCollection.has_map_imagery = hasTag(collection, 'gibs')
      }

      if (collection && collection.collection_data_type) {
        transformedCollection.is_nrt = [
          'NEAR_REAL_TIME',
          'LOW_LATENCY',
          'EXPEDITED'
        ].includes(collection.collection_data_type)
      }

      if (collection && collection.organizations) {
        transformedCollection.isCSDA = isCSDACollection(collection.organizations)
      }

      const h = getApplicationConfig().thumbnailSize.height
      const w = getApplicationConfig().thumbnailSize.width

      // Retrieve collection thumbnail if it exists
      if (transformedCollection.id) {
        if (collection.browse_flag) {
          transformedCollection.thumbnail = `${getEnvironmentConfig().apiHost}/scale/collections/${transformedCollection.id}?h=${h}&w=${w}&ee=${earthdataEnvironment}`
        } else {
          transformedCollection.thumbnail = unavailableImg
          transformedCollection.isDefaultImage = true
        }
      }

      return transformedCollection
    })

    return camelcaseKeys(data, {
      deep: true,
      exclude: ['isCSDA'],
      stopPaths: ['feed.entry.tags']
    })
  }
}
