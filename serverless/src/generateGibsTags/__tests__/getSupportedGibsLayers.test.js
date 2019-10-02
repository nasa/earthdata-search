import nock from 'nock'
import gibsResponse from './mocks'
import { getSupportedGibsLayers } from '../getSupportedGibsLayers'

beforeEach(() => {
  jest.clearAllMocks()

  nock(/worldview/)
    .get(/wv\.json/)
    .reply(200, gibsResponse)
})

describe('getSupportedGibsLayers', () => {
  test('correctly excludes layers with faulty projections', async () => {
    const response = await getSupportedGibsLayers(false)

    expect(Object.keys(response)).not.toContain('ExcludedProjection_Value')
    expect(Object.keys(response)).not.toContain('MissingProjection_Value')
  })

  test('with custom gibs layers merged', async () => {
    const response = await getSupportedGibsLayers()

    expect(Object.keys(response)).toContain('MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily')
    expect(Object.keys(response)).toContain('MOPITT_CO_Monthly_Total_Column_Day')
    expect(Object.keys(response).length).toEqual(48)
  })

  describe('without custom gibs layers merged', () => {
    test('correctly returns supported layers', async () => {
      const response = await getSupportedGibsLayers(false)

      expect(Object.keys(response)).toEqual(['MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'])
    })
  })
})
