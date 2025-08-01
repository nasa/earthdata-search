import { getApplicationConfig } from '../../../../../sharedUtils/config'

const { collectionSearchResultsSortKey: defaultSortKey } = getApplicationConfig()

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

export const decodeCollectionSortKey = (params) => {
  const {
    csk
  } = params

  return csk || defaultSortKey
}
