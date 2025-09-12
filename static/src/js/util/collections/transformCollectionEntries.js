import camelcaseKeys from 'camelcase-keys'
import { getApplicationConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'

import { hasTag } from '../../../../../sharedUtils/tags'
import { isCSDACollection } from '../isCSDACollection'
import { getOpenSearchOsddLink } from '../../../../../sharedUtils/getOpenSearchOsddLink'

import unavailableImg from '../../../assets/images/image-unavailable.svg'

/**
 * Transform collection entries from CMR format to frontend format
 * @param {Array} entries - Array of collection entries from CMR
 * @param {String} earthdataEnvironment - The Earthdata environment
 * @returns {Array} Transformed collection entries with camelCase keys
 */
export const transformCollectionEntries = (entries, earthdataEnvironment) => {
  if (!Array.isArray(entries)) {
    return []
  }

  // Iterate over the collections
  entries.map((collection) => {
    const transformedCollection = collection

    transformedCollection.conceptId = collection.id

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
    if (collection.id) {
      if (collection.browse_flag) {
        transformedCollection.thumbnail = `${getEnvironmentConfig().apiHost}/scale/collections/${collection.id}?h=${h}&w=${w}&ee=${earthdataEnvironment}`
      } else {
        transformedCollection.thumbnail = unavailableImg
        transformedCollection.isDefaultImage = true
      }
    }

    return transformedCollection
  })

  return camelcaseKeys(entries, {
    deep: true,
    exclude: ['isCSDA'],
    stopPaths: ['tags']
  })
}

export default transformCollectionEntries
