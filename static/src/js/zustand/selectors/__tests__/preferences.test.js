import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import {
  getPreferences,
  getMapPreferences,
  getCollectionSortPreference,
  getCollectionSortKeyParameter
} from '../preferences'

import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'

import configureStore from '../../../store/configureStore'
import { getParamCollectionSortKey } from '../../../selectors/query'

jest.mock('../../../store/configureStore')
jest.mock('../../../selectors/query')

const mockConfigureStore = configureStore
const mockGetParamCollectionSortKey = getParamCollectionSortKey

describe('getPreferences', () => {
  test('returns preferences from the zustand state', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default',
          granuleSort: 'default',
          panelState: 'default',
          collectionListView: 'default',
          granuleListView: 'default',
          mapView: {
            zoom: 3,
            latitude: 0,
            longitude: 0,
            projection: projectionCodes.geographic,
            baseLayer: mapLayers.worldImagery,
            overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
            rotation: 0
          }
        }
      }
    }

    expect(getPreferences(state)).toEqual({
      collectionSort: 'default',
      granuleSort: 'default',
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default',
      mapView: {
        zoom: 3,
        latitude: 0,
        longitude: 0,
        projection: projectionCodes.geographic,
        baseLayer: mapLayers.worldImagery,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels],
        rotation: 0
      }
    })
  })
})

describe('getMapPreferences', () => {
  test('returns map preferences from the zustand state', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default',
          granuleSort: 'default',
          mapView: {
            zoom: 5,
            latitude: 39.5,
            longitude: -98.35,
            projection: projectionCodes.geographic,
            baseLayer: mapLayers.worldImagery,
            overlayLayers: [mapLayers.bordersRoads],
            rotation: 0
          }
        }
      }
    }

    expect(getMapPreferences(state)).toEqual({
      zoom: 5,
      latitude: 39.5,
      longitude: -98.35,
      projection: projectionCodes.geographic,
      baseLayer: mapLayers.worldImagery,
      overlayLayers: [mapLayers.bordersRoads],
      rotation: 0
    })
  })
})

describe('getCollectionSortPreference', () => {
  test('returns collection sort preference from the zustand state', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-usage_score',
          granuleSort: 'default'
        }
      }
    }

    expect(getCollectionSortPreference(state)).toEqual('-usage_score')
  })

  test('returns default when collectionSort is default', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default',
          granuleSort: 'default'
        }
      }
    }

    expect(getCollectionSortPreference(state)).toEqual('default')
  })
})

describe('getCollectionSortKeyParameter', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: '-usage_score'
    }))

    const mockGetState = jest.fn()
    mockConfigureStore.mockReturnValue({
      getState: mockGetState
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('returns null when paramCollectionSortKey is not provided', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default'
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue(null)
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue(undefined)
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue('')
    expect(getCollectionSortKeyParameter(state)).toBeNull()
  })

  test('returns the paramCollectionSortKey when it differs from user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This translates to '-usage_score'
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-score')
  })

  test('returns null when paramCollectionSortKey matches direct user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-usage_score'
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-usage_score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()
  })

  test('returns null when paramCollectionSortKey matches translated default user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This translates to '-usage_score'
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-usage_score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()
  })

  test('returns null when paramCollectionSortKey matches non-default user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-score'
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()
  })

  test('returns the paramCollectionSortKey when user has no preferences set', () => {
    const state = {
      preferences: {
        preferences: {}
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-score')
  })

  test('returns the paramCollectionSortKey when preferences structure is invalid', () => {
    const state = {
      preferences: {
        preferences: undefined
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-score')
  })

  test('handles different default sort key configuration', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: '-score'
    }))

    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This now translates to '-score'
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue('-usage_score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-usage_score')
  })

  test('handles undefined collectionSort preference by defaulting to usage_score', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: '-usage_score'
    }))

    const state = {
      preferences: {
        preferences: {
          collectionSort: undefined
        }
      }
    }

    mockGetParamCollectionSortKey.mockReturnValue('-usage_score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-score')
  })
})
