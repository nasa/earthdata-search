import {
  getCollectionSortPreference,
  getGranuleSortPreference,
  getMapPreferences,
  getCollectionSortKeyParameter
} from '../preferences'
import { collectionSortKeys } from '../../constants/collectionSortKeys'
import * as getApplicationConfig from '../../../../../sharedUtils/config'
import mapLayers from '../../constants/mapLayers'
import projections from '../../util/map/projections'

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
            baseLayer: mapLayers.worldImagery,
            latitude: 39,
            longitude: -95,
            overlayLayers: [
              mapLayers.bordersRoads,
              mapLayers.placeLabels
            ],
            projection: projections.geographic
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

describe('getCollectionSortKeyParameter', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: collectionSortKeys.usageDescending
    }))
  })

  test('returns undefined when paramCollectionSortKey is not defined', () => {
    const state = {
      query: {
        collection: {
          paramCollectionSortKey: undefined
        }
      }
    }

    expect(getCollectionSortKeyParameter(state)).toEqual(undefined)
  })

  test('returns the proper collection paramCollectionSortKey when it is not the same as the user preference sort key', () => {
    const state = {
      query: {
        collection: {
          paramCollectionSortKey: collectionSortKeys.startDateAscending
        }
      },
      preferences: {
        preferences: {
          collectionSort: collectionSortKeys.usageDescending
        }
      }
    }

    expect(getCollectionSortKeyParameter(state)).toEqual(collectionSortKeys.startDateAscending)
  })

  test('returns the null when the user preference sort key and the paramCollectionSortKey is the same', () => {
    const state = {
      query: {
        collection: {
          paramCollectionSortKey: collectionSortKeys.startDateAscending
        }
      },
      preferences: {
        preferences: {
          collectionSort: collectionSortKeys.startDateAscending
        }
      }
    }

    expect(getCollectionSortKeyParameter(state)).toEqual(null)
  })
})
