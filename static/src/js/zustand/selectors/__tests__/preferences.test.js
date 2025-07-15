import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import {
  getPreferences,
  getMapPreferences,
  getCollectionSortPreference,
  getCollectionSortKeyParameterSelector
} from '../preferences'

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
            projection: 'epsg4326',
            baseLayer: 'worldImagery',
            overlayLayers: ['bordersRoads', 'placeLabels'],
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
        projection: 'epsg4326',
        baseLayer: 'worldImagery',
        overlayLayers: ['bordersRoads', 'placeLabels'],
        rotation: 0
      }
    })
  })

  test('returns preferences when preferences structure exists', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-usage_score',
          granuleSort: '-start_date'
        }
      }
    }

    expect(getPreferences(state)).toEqual({
      collectionSort: '-usage_score',
      granuleSort: '-start_date'
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
            projection: 'epsg4326',
            baseLayer: 'worldImagery',
            overlayLayers: ['bordersRoads'],
            rotation: 0
          }
        }
      }
    }

    expect(getMapPreferences(state)).toEqual({
      zoom: 5,
      latitude: 39.5,
      longitude: -98.35,
      projection: 'epsg4326',
      baseLayer: 'worldImagery',
      overlayLayers: ['bordersRoads'],
      rotation: 0
    })
  })

  test('returns undefined when mapView is not set', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default',
          granuleSort: 'default'
        }
      }
    }

    expect(getMapPreferences(state)).toBeUndefined()
  })

  test('returns undefined when preferences are undefined', () => {
    const state = {
      preferences: {
        preferences: undefined
      }
    }

    expect(getMapPreferences(state)).toBeUndefined()
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

  test('returns undefined when collectionSort is not set', () => {
    const state = {
      preferences: {
        preferences: {
          granuleSort: 'default'
        }
      }
    }

    expect(getCollectionSortPreference(state)).toBeUndefined()
  })

  test('returns undefined when preferences are undefined', () => {
    const state = {
      preferences: {
        preferences: undefined
      }
    }

    expect(getCollectionSortPreference(state)).toBeUndefined()
  })
})

describe('getCollectionSortKeyParameterSelector', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: '-usage_score'
    }))
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

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector(null)).toBeNull()
    expect(selector(undefined)).toBeNull()
    expect(selector('')).toBeNull()
  })

  test('returns the paramCollectionSortKey when it differs from user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This translates to '-usage_score'
        }
      }
    }

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-score')).toEqual('-score')
  })

  test('returns null when paramCollectionSortKey matches direct user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-usage_score'
        }
      }
    }

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-usage_score')).toBeNull()
  })

  test('returns null when paramCollectionSortKey matches translated default user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This translates to '-usage_score'
        }
      }
    }

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-usage_score')).toBeNull()
  })

  test('returns null when paramCollectionSortKey matches non-default user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-score'
        }
      }
    }

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-score')).toBeNull()
  })

  test('returns the paramCollectionSortKey when user has no preferences set', () => {
    const state = {
      preferences: {
        preferences: {}
      }
    }

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-score')).toEqual('-score')
  })

  test('returns the paramCollectionSortKey when preferences are undefined', () => {
    const state = {
      preferences: {
        preferences: undefined
      }
    }

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-score')).toEqual('-score')
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

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-score')).toBeNull()
    expect(selector('-usage_score')).toEqual('-usage_score')
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

    const selector = getCollectionSortKeyParameterSelector(state)
    expect(selector('-usage_score')).toBeNull()
    expect(selector('-score')).toEqual('-score')
  })
})
