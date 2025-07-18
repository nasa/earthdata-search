// @ts-expect-error The file does not have types
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import {
  getPreferences,
  getMapPreferences,
  getCollectionSortPreference,
  getCollectionSortKeyParameter
} from '../preferences'

import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'
import { EdscStore, PreferencesData } from '../../types'

// @ts-expect-error The file does not have types
import configureStore from '../../../store/configureStore'
// @ts-expect-error The file does not have types
import { getParamCollectionSortKey } from '../../../selectors/query'

jest.mock('../../../store/configureStore')
jest.mock('../../../selectors/query')

const mockConfigureStore = configureStore as jest.MockedFunction<typeof configureStore>
const mockGetParamCollectionSortKey = getParamCollectionSortKey as jest.MockedFunction<
  typeof getParamCollectionSortKey
>

const createMockState = (preferences: Partial<PreferencesData> = {}): Pick<EdscStore, 'preferences'> => ({
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
      },
      ...preferences
    },
    isSubmitting: false,
    isSubmitted: false,
    setPreferences: jest.fn(),
    setPreferencesFromJwt: jest.fn(),
    submitAndUpdatePreferences: jest.fn()
  }
})

describe('getPreferences', () => {
  test('returns preferences from the zustand state', () => {
    const state = createMockState()

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
    const state = createMockState({
      mapView: {
        zoom: 5,
        latitude: 39.5,
        longitude: -98.35,
        projection: projectionCodes.geographic,
        baseLayer: mapLayers.worldImagery,
        overlayLayers: [mapLayers.bordersRoads],
        rotation: 0
      }
    })

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
    const state = createMockState({
      collectionSort: '-usage_score'
    })

    expect(getCollectionSortPreference(state)).toEqual('-usage_score')
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
    const state = createMockState({
      collectionSort: 'default'
    })

    mockGetParamCollectionSortKey.mockReturnValue(null)
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue(undefined)
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue('')
    expect(getCollectionSortKeyParameter(state)).toBeNull()
  })

  test('returns the paramCollectionSortKey when it differs from user preference', () => {
    const state = createMockState({
      collectionSort: 'default' // This translates to '-usage_score'
    })

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-score')
  })

  test('returns null when paramCollectionSortKey matches direct user preference', () => {
    const state = createMockState({
      collectionSort: '-usage_score'
    })

    mockGetParamCollectionSortKey.mockReturnValue('-usage_score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()
  })

  test('handles default collectionSort preference by defaulting to usage_score', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: '-usage_score'
    }))

    const state = createMockState({
      collectionSort: 'default'
    })

    mockGetParamCollectionSortKey.mockReturnValue('-usage_score')
    expect(getCollectionSortKeyParameter(state)).toBeNull()

    mockGetParamCollectionSortKey.mockReturnValue('-score')
    expect(getCollectionSortKeyParameter(state)).toEqual('-score')
  })
})
