import { getMapPreferences } from '../preferences'

describe('getMapPreferences selector', () => {
  test('returns the granule metadata', () => {
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
