import {
  getSitePreferences,
  getMapPreferences,
  getCollectionSortPreference,
  getUser,
  getUsername
} from '../user'

import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'

import useEdscStore from '../../useEdscStore'
import { PreferencesData } from '../../types'
import { initialSitePreferences } from '../../slices/createUserSlice'

jest.mock('../../../store/configureStore')

describe('getUser', () => {
  test('returns user slice from the zustand state', () => {
    expect(getUser(useEdscStore.getState())).toEqual({
      sitePreferences: initialSitePreferences,
      username: undefined,
      setSitePreferences: expect.any(Function),
      setUsername: expect.any(Function)
    })
  })
})

describe('getUsername', () => {
  test('returns username from the zustand state', () => {
    useEdscStore.setState((state) => {
      state.user.username = 'test_user'
    })

    expect(getUsername(useEdscStore.getState())).toEqual('test_user')
  })
})

describe('getSitePreferences', () => {
  test('returns preferences from the zustand state', () => {
    expect(getSitePreferences(useEdscStore.getState())).toEqual({
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
    useEdscStore.setState((state) => {
      state.user.sitePreferences.mapView = {
        zoom: 5,
        latitude: 39.5,
        longitude: -98.35,
        projection: projectionCodes.geographic,
        baseLayer: mapLayers.worldImagery,
        overlayLayers: [mapLayers.bordersRoads],
        rotation: 0
      } as PreferencesData['mapView']
    })

    expect(getMapPreferences(useEdscStore.getState())).toEqual({
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
    useEdscStore.setState((state) => {
      state.user.sitePreferences.collectionSort = '-usage_score'
    })

    expect(getCollectionSortPreference(useEdscStore.getState())).toEqual('-usage_score')
  })
})
