import MockDate from 'mockdate'

import { gibsResponse } from './mocks'
import { constructLayerTagData } from '../constructLayerTagData'

beforeEach(() => {
  jest.clearAllMocks()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('1988-09-03T10:00:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('constructLayerTagData', () => {
  test('ignores layers without a concept id', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers } = JSON.parse(JSON.stringify(gibsResponse))
    const { AMSR2_Cloud_Liquid_Water_Day: testingLayer } = layers

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([])
  })

  test('constructs correct tag data when a single concept id is provided', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers } = JSON.parse(JSON.stringify(gibsResponse))
    const { AMSRE_Surface_Rain_Rate_Night: testingLayer } = layers

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            concept_id: 'C1000000001-EDSC'
          }
        },
        data: {
          antarctic: false,
          antarctic_resolution: null,
          arctic: false,
          arctic_resolution: null,
          format: 'png',
          geographic: true,
          geographic_resolution: '2km',
          group: 'overlays',
          match: {
            day_night_flag: 'night',
            time_end: '<=2011-10-04T00:00:00Z',
            time_start: '>=2002-06-01T00:00:00Z'
          },
          product: 'AMSRE_Surface_Rain_Rate_Night',
          source: 'Aqua / AMSR-E',
          title: 'Surface Rain Rate (Night)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data when a single concept id is provided', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers } = JSON.parse(JSON.stringify(gibsResponse))
    const { AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day: testingLayer } = layers

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            concept_id: 'C1000000002-EDSC'
          }
        },
        data: {
          group: 'overlays',
          match: {
            day_night_flag: 'day',
            time_start: '>=2002-08-30T00:00:00Z'
          },
          product: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
          source: 'Aqua / AIRS',
          title: 'Methane (L2, 400 hPa, Day)',
          updated_at: '1988-09-03T10:00:00.000Z',
          antarctic: false,
          antarctic_resolution: null,
          arctic: false,
          arctic_resolution: null,
          format: 'png',
          geographic: true,
          geographic_resolution: '2km'
        }
      }, {
        collection: {
          condition: {
            concept_id: 'C1000000003-EDSC'
          }
        },
        data: {
          antarctic: false,
          antarctic_resolution: null,
          arctic: false,
          arctic_resolution: null,
          format: 'png',
          geographic: true,
          geographic_resolution: '2km',
          group: 'overlays',
          match: {
            day_night_flag: 'day',
            time_start: '>=2002-08-30T00:00:00Z'
          },
          product: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
          source: 'Aqua / AIRS',
          title: 'Methane (L2, 400 hPa, Day)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data when only a start date is provided', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers } = JSON.parse(JSON.stringify(gibsResponse))
    const { AMSRE_Surface_Rain_Rate_Night: testingLayer } = layers

    delete testingLayer.endDate

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            concept_id: 'C1000000001-EDSC'
          }
        },
        data: {
          antarctic: false,
          antarctic_resolution: null,
          arctic: false,
          arctic_resolution: null,
          format: 'png',
          geographic: true,
          geographic_resolution: '2km',
          group: 'overlays',
          match: {
            day_night_flag: 'night',
            time_start: '>=2002-06-01T00:00:00Z'
          },
          product: 'AMSRE_Surface_Rain_Rate_Night',
          source: 'Aqua / AMSR-E',
          title: 'Surface Rain Rate (Night)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data when only an end date is provided', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers } = JSON.parse(JSON.stringify(gibsResponse))
    const { AMSRE_Surface_Rain_Rate_Night: testingLayer } = layers

    delete testingLayer.startDate

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            concept_id: 'C1000000001-EDSC'
          }
        },
        data: {
          antarctic: false,
          antarctic_resolution: null,
          arctic: false,
          arctic_resolution: null,
          format: 'png',
          geographic: true,
          geographic_resolution: '2km',
          group: 'overlays',
          match: {
            day_night_flag: 'night',
            time_end: '<=2011-10-04T00:00:00Z'
          },
          product: 'AMSRE_Surface_Rain_Rate_Night',
          source: 'Aqua / AMSR-E',
          title: 'Surface Rain Rate (Night)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data when no daynight flag is provided', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers } = JSON.parse(JSON.stringify(gibsResponse))
    const { AMSRE_Surface_Rain_Rate_Night: testingLayer } = layers

    delete testingLayer.daynight

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            concept_id: 'C1000000001-EDSC'
          }
        },
        data: {
          antarctic: false,
          antarctic_resolution: null,
          arctic: false,
          arctic_resolution: null,
          format: 'png',
          geographic: true,
          geographic_resolution: '2km',
          group: 'overlays',
          match: {
            time_end: '<=2011-10-04T00:00:00Z',
            time_start: '>=2002-06-01T00:00:00Z'
          },
          product: 'AMSRE_Surface_Rain_Rate_Night',
          source: 'Aqua / AMSR-E',
          title: 'Surface Rain Rate (Night)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })
})
