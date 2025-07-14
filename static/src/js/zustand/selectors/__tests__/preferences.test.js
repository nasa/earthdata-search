import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import {
  getPreferences,
  getMapPreferences,
  getCollectionSortPreference,
  getCollectionSortKeyParameter
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

describe('getCollectionSortKeyParameter', () => {
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

    expect(getCollectionSortKeyParameter(null, state)).toBeNull()
    expect(getCollectionSortKeyParameter(undefined, state)).toBeNull()
    expect(getCollectionSortKeyParameter('', state)).toBeNull()
  })

  test('returns the paramCollectionSortKey when it differs from user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This translates to '-usage_score'
        }
      }
    }

    expect(getCollectionSortKeyParameter('-score', state)).toEqual('-score')
  })

  test('returns null when paramCollectionSortKey matches translated user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: 'default' // This translates to '-usage_score'
        }
      }
    }

    expect(getCollectionSortKeyParameter('-usage_score', state)).toBeNull()
  })

  test('returns null when paramCollectionSortKey matches non-default user preference', () => {
    const state = {
      preferences: {
        preferences: {
          collectionSort: '-score'
        }
      }
    }

    expect(getCollectionSortKeyParameter('-score', state)).toBeNull()
  })

  test('returns the paramCollectionSortKey when user has no preferences set', () => {
    const state = {
      preferences: {
        preferences: {}
      }
    }

    expect(getCollectionSortKeyParameter('-score', state)).toEqual('-score')
  })

  test('returns the paramCollectionSortKey when preferences are undefined', () => {
    const state = {
      preferences: {
        preferences: undefined
      }
    }

    expect(getCollectionSortKeyParameter('-score', state)).toEqual('-score')
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

    expect(getCollectionSortKeyParameter('-score', state)).toBeNull()
    expect(getCollectionSortKeyParameter('-usage_score', state)).toEqual('-usage_score')
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

    expect(getCollectionSortKeyParameter('-usage_score', state)).toBeNull()
    expect(getCollectionSortKeyParameter('-score', state)).toEqual('-score')
  })
})
