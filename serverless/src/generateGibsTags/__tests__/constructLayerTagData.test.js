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
  test('constructs correct tag data when no end date is present', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers, products } = JSON.parse(JSON.stringify(gibsResponse))
    const { MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: testingLayer } = layers

    const { product } = testingLayer
    const { [product]: productObject } = products

    testingLayer.product = productObject

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
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
            day_night_flag: 'NIGHT',
            time_start: '>=2002-07-04T00:00:00Z'
          },
          product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          source: 'Aqua / MODIS',
          title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data when no start date is present', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers, products } = JSON.parse(JSON.stringify(gibsResponse))
    const { MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: testingLayer } = layers

    delete testingLayer.startDate

    const { product } = testingLayer
    const { [product]: productObject } = products

    testingLayer.product = productObject

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
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
            day_night_flag: 'NIGHT'
          },
          product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          source: 'Aqua / MODIS',
          title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data for non nrt/science layers', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers, products } = JSON.parse(JSON.stringify(gibsResponse))
    const { MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: testingLayer } = layers

    testingLayer.endDate = '2002-09-05T23:059:59Z'

    const { product } = testingLayer
    const { [product]: productObject } = products

    testingLayer.product = productObject

    const response = constructLayerTagData(testingLayer)

    expect(response).toEqual([
      {
        collection: {
          condition: {
            short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
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
            day_night_flag: 'NIGHT',
            time_start: '>=2002-07-04T00:00:00Z',
            time_end: '<=2002-09-05T23:059:59Z'
          },
          product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          source: 'Aqua / MODIS',
          title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
          updated_at: '1988-09-03T10:00:00.000Z'
        }
      }
    ])
  })

  test('constructs correct tag data nrt/science layers', () => {
    // Deep copy the gibs import to prevent issues when overwriting keys for testing
    const { layers, products } = JSON.parse(JSON.stringify(gibsResponse))
    const { MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: testingLayer } = layers

    testingLayer.endDate = '2002-09-05T23:059:59Z'

    const { product } = testingLayer
    const { [product]: productObject } = products

    productObject.query = {
      science: {
        shortName: 'MYD09GA'
      },
      nrt: {
        shortName: 'MYD09'
      }
    }
    testingLayer.product = productObject

    const response = constructLayerTagData(testingLayer)

    const sharedParams = {
      collection: {
        condition: {
          short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
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
          time_start: '>=2002-07-04T00:00:00Z',
          time_end: '<=2002-09-05T23:059:59Z'
        },
        product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
        source: 'Aqua / MODIS',
        title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
        updated_at: '1988-09-03T10:00:00.000Z'
      }
    }

    expect(response).toEqual([
      {
        ...sharedParams,
        collection: {
          condition: {
            short_name: 'MYD09GA'
          }
        }
      }, {
        ...sharedParams,
        collection: {
          condition: {
            short_name: 'MYD09'
          }
        }
      }
    ])
  })
})
