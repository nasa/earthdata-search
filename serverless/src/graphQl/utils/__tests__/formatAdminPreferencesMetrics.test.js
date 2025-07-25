import mapLayers from '../../../../../static/src/js/constants/mapLayers'
import projectionCodes from '../../../../../static/src/js/constants/projectionCodes'
import formatAdminPreferencesMetrics from '../formatAdminPreferencesMetrics'

const defaultAdminPreferencesMetricsResponse = [
  {
    site_preferences: {
      mapView: {
        zoom: 1,
        latitude: 0,
        baseLayer: mapLayers.worldImagery,
        longitude: 0,
        projection: projectionCodes.geographic,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
      },
      panelState: 'open',
      granuleSort: 'start_date',
      collectionSort: '-score',
      granuleListView: 'default',
      collectionListView: 'list'
    }
  },
  {
    site_preferences: {
      mapView: {
        zoom: 2,
        latitude: 0,
        baseLayer: mapLayers.worldImagery,
        longitude: 0,
        projection: projectionCodes.geographic,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
      },
      panelState: 'open',
      granuleSort: '-start_date',
      collectionSort: '-score',
      granuleListView: 'default',
      collectionListView: 'default'
    }
  },
  {
    site_preferences: {
      mapView: {
        zoom: 3,
        latitude: 0,
        baseLayer: mapLayers.worldImagery,
        longitude: 0,
        projection: projectionCodes.geographic,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
      },
      panelState: 'open',
      granuleSort: '-start_date',
      collectionSort: '-score',
      granuleListView: 'default',
      collectionListView: 'default'
    }
  },
  {
    site_preferences: {
      mapView: {
        zoom: 4,
        latitude: 0,
        baseLayer: mapLayers.worldImagery,
        longitude: 0,
        projection: projectionCodes.geographic,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
      },
      panelState: 'open',
      granuleSort: '-start_date',
      collectionSort: '-score',
      granuleListView: 'default',
      collectionListView: 'default'
    }
  },
  {
    site_preferences: {
      mapView: {
        zoom: 5,
        latitude: 0,
        baseLayer: mapLayers.worldImagery,
        longitude: 0,
        projection: projectionCodes.geographic,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
      },
      panelState: 'open',
      granuleSort: '-start_date',
      collectionSort: '-score',
      granuleListView: 'default',
      collectionListView: 'default'
    }
  },
  {
    site_preferences: {
      mapView: {
        zoom: 6,
        latitude: 0,
        baseLayer: mapLayers.worldImagery,
        longitude: 0,
        projection: projectionCodes.geographic,
        overlayLayers: [mapLayers.bordersRoads, mapLayers.placeLabels]
      },
      panelState: 'open',
      granuleSort: '-start_date',
      collectionSort: '-score',
      granuleListView: 'default',
      collectionListView: 'default'
    }
  },
  {
    site_preferences: {}
  },
  {
    site_preferences: {}
  }
]

describe('formatAdminPreferencesMetrics', () => {
  describe('when formatting a valid response', () => {
    test('returns the expected formatted result', () => {
      const formattedResult = formatAdminPreferencesMetrics(defaultAdminPreferencesMetricsResponse)

      expect(formattedResult).toEqual(
        {
          panelState: [
            {
              count: '6',
              value: 'open',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (open)',
              percentage: '25.0'
            }
          ],
          granuleSort: [
            {
              count: '5',
              value: '-start_date',
              percentage: '62.5'
            },
            {
              count: '2',
              value: 'not set (-start_date)',
              percentage: '25.0'
            },
            {
              count: '1',
              value: 'start_date',
              percentage: '12.5'
            }
          ],
          granuleListView: [
            {
              count: '6',
              value: 'default',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (default)',
              percentage: '25.0'
            }
          ],
          collectionSort: [
            {
              count: '6',
              value: '-score',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (-score)',
              percentage: '25.0'
            }
          ],
          collectionListView: [
            {
              count: '5',
              value: 'default',
              percentage: '62.5'
            },
            {
              count: '2',
              value: 'not set (default)',
              percentage: '25.0'
            },
            {
              count: '1',
              value: 'list',
              percentage: '12.5'
            }
          ],
          zoom: [
            {
              count: '2',
              value: 'not set (3)',
              percentage: '25.0'
            },
            {
              count: '1',
              value: '1',
              percentage: '12.5'
            },
            {
              count: '1',
              value: '2',
              percentage: '12.5'
            },
            {
              count: '1',
              value: '3',
              percentage: '12.5'
            },
            {
              count: '1',
              value: '4',
              percentage: '12.5'
            },
            {
              count: '1',
              value: '5',
              percentage: '12.5'
            }
          ],
          latitude: [
            {
              count: '6',
              value: '0',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (0)',
              percentage: '25.0'
            }
          ],
          longitude: [
            {
              count: '6',
              value: '0',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (0)',
              percentage: '25.0'
            }
          ],
          projection: [
            {
              count: '6',
              value: 'epsg4326',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (epsg4326)',
              percentage: '25.0'
            }
          ],
          overlayLayers: [
            {
              count: '6',
              value: 'bordersRoads',
              percentage: '75.0'
            },
            {
              count: '6',
              value: 'placeLabels',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (bordersRoads & placeLabels)',
              percentage: '25.0'
            }
          ],
          baseLayer: [
            {
              count: '6',
              value: 'worldImagery',
              percentage: '75.0'
            },
            {
              count: '2',
              value: 'not set (worldImagery)',
              percentage: '25.0'
            }
          ]
        }
      )
    })
  })

  describe('when formatting a empty response', () => {
    test('returns the expected response', () => {
      const formattedResult = formatAdminPreferencesMetrics([])

      expect(formattedResult).toEqual({
        panelState: [],
        granuleSort: [],
        granuleListView: [],
        collectionSort: [],
        collectionListView: [],
        zoom: [],
        latitude: [],
        longitude: [],
        projection: [],
        overlayLayers: [],
        baseLayer: []
      })
    })
  })
})
