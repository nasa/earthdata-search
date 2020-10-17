import nock from 'nock'
import { gibsResponse, capabilitiesResponse } from './mocks'
import { getSupportedGibsLayers } from '../getSupportedGibsLayers'

beforeEach(() => {
  jest.clearAllMocks()

  nock(/worldview/)
    .get(/wv\.json/)
    .reply(200, gibsResponse)

  nock(/gibs\.earthdata/)
    .get(/epsg4326\/best\/wmts.cgi/)
    .reply(200, capabilitiesResponse)

  nock(/gibs\.earthdata/)
    .get(/epsg3413\/best\/wmts.cgi/)
    .reply(200, capabilitiesResponse)

  nock(/gibs\.earthdata/)
    .get(/epsg3031\/best\/wmts.cgi/)
    .reply(200, capabilitiesResponse)
})

describe('getSupportedGibsLayers', () => {
  test('correctly excludes layers with faulty projections', async () => {
    const response = await getSupportedGibsLayers(false)

    expect(Object.keys(response)).not.toContain('ExcludedProjection_Value')
    expect(Object.keys(response)).not.toContain('MissingProjection_Value')

    expect(response.MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily.matrixLimits).toEqual({
      '2km': {
        0: {
          matrixHeight: 1,
          matrixWidth: 2
        },
        1: {
          matrixHeight: 2,
          matrixWidth: 3
        },
        2: {
          matrixHeight: 3,
          matrixWidth: 5
        }
      }
    })
  })

  test('with custom gibs layers merged', async () => {
    const response = await getSupportedGibsLayers()

    expect(Object.keys(response)).toContain('MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily')
    expect(Object.keys(response)).toContain('MOPITT_CO_Monthly_Total_Column_Day')
    expect(Object.keys(response).length).toEqual(48)

    expect(response.MOPITT_CO_Monthly_Total_Column_Day.matrixLimits).toEqual({
      '2km': {
        0: {
          matrixHeight: 1,
          matrixWidth: 2
        },
        1: {
          matrixHeight: 2,
          matrixWidth: 3
        },
        2: {
          matrixHeight: 3,
          matrixWidth: 5
        }
      }
    })
  })

  describe('without custom gibs layers merged', () => {
    test('correctly returns supported layers', async () => {
      const response = await getSupportedGibsLayers(false)

      expect(Object.keys(response)).toEqual(['MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'])

      expect(response.MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily.matrixLimits).toEqual({
        '2km': {
          0: {
            matrixHeight: 1,
            matrixWidth: 2
          },
          1: {
            matrixHeight: 2,
            matrixWidth: 3
          },
          2: {
            matrixHeight: 3,
            matrixWidth: 5
          }
        }
      })
    })
  })
})
