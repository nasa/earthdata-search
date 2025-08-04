import {
  getPreferences,
  getMapPreferences,
  getCollectionSortPreference
} from '../preferences'

import mapLayers from '../../../constants/mapLayers'
import projectionCodes from '../../../constants/projectionCodes'

import useEdscStore from '../../useEdscStore'
import { PreferencesData } from '../../types'

jest.mock('../../../store/configureStore')

describe('getPreferences', () => {
  test('returns preferences from the zustand state', () => {
    expect(getPreferences(useEdscStore.getState())).toEqual({
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
      // eslint-disable-next-line no-param-reassign
      state.preferences.preferences.mapView = {
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
      // eslint-disable-next-line no-param-reassign
      state.preferences.preferences.collectionSort = '-usage_score'
    })

    expect(getCollectionSortPreference(useEdscStore.getState())).toEqual('-usage_score')
  })
})
