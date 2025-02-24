import {
  getCollectionSortPreference,
  getGranuleSortPreference,
  getMapPreferences,
  getNondefaultCollectionSortKey
} from '../preferences'
import { collectionSortKeys } from '../../constants/collectionSortKeys'

describe('getMapPreferences selector', () => {
  test('returns the map preferences', () => {
    const state = {
      preferences: {
        preferences: {
          panelState: 'collapsed',
          collectionListView: 'list',
          granuleListView: 'table',
          mapView: {
            zoom: 4,
            baseLayer: 'blueMarble',
            latitude: 39,
            longitude: -95,
            overlayLayers: [
              'referenceFeatures',
              'referenceLabels'
            ],
            projection: 'epsg4326'
          }
        }
      }
    }

    expect(getMapPreferences(state)).toEqual(state.preferences.preferences.mapView)
  })

  test('returns an empty object when there is no focusedGranule', () => {
    const state = {}

    expect(getMapPreferences(state)).toEqual({})
  })
})

describe('getCollectionSortPreference selector', () => {
  test('returns the collection sort preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: collectionSortKeys.usageDescending
        }
      }
    }

    expect(getCollectionSortPreference(state)).toEqual(state.preferences.preferences.collectionSort)
  })

  test('returns default when there is no preference', () => {
    const state = {}

    expect(getCollectionSortPreference(state)).toEqual('default')
  })
})

describe('getGranuleSortPreference selector', () => {
  test('returns the collection sort preference', () => {
    const state = {
      preferences: {
        preferences: {
          granuleSort: '-end_date'
        }
      }
    }

    expect(getGranuleSortPreference(state)).toEqual(state.preferences.preferences.granuleSort)
  })

  test('returns default when there is no preference', () => {
    const state = {}

    expect(getGranuleSortPreference(state)).toEqual('default')
  })
})

describe('getNondefaultCollectionSortKey', () => {
  test('returns null when the sortKey is the default value of collectionSortKeys.usageDescending', () => {
    const state = {
      query: {
        collection: {
          sortKey: [collectionSortKeys.usageDescending]
        }
      }
    }

    expect(getNondefaultCollectionSortKey(state)).toEqual(null)
  })

  test('returns the proper collection sortKey when it is not the default of collectionSortKeys.usageDescending', () => {
    const state = {
      query: {
        collection: {
          sortKey: [collectionSortKeys.startDateAscending]
        }
      }
    }

    expect(getNondefaultCollectionSortKey(state)).toEqual(collectionSortKeys.startDateAscending)
  })
})
