import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { collectionSearchResultsSortKey: defaultSortKey } = getApplicationConfig()

/**
 * Encodes the collection sort key, returning undefined if the key matches the preference.
 * @param {String} collectionSortKey - The collection sort key to encode.
 * @param {String} collectionSortPreference - The collection sort preference to encode.
 * @returns {Object} The encoded collection sort key.
 */
export const encodeCollectionSortKey = (collectionSortKey, collectionSortPreference) => {
  if (collectionSortPreference === 'default' && defaultSortKey === collectionSortKey) {
    return undefined
  }

  if (collectionSortPreference !== 'default' && collectionSortPreference === collectionSortKey) {
    return undefined
  }

  return {
    csk: collectionSortKey
  }
}

/**
 * Decodes the collection sort key from a URL.
 * @param {Object} params - The URL parameters to decode.
 * @returns {String} The decoded collection sort key.
 */
export const decodeCollectionSortKey = (params) => {
  const {
    csk
  } = params

  return csk
}
