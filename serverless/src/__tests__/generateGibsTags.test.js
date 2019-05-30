import request from 'request-promise'
import gibsResponse from './mocks'
import { getSupportedGibsLayers } from '../generateGibsTags'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getSupportedGibsLayers', () => {
  test('correctly returns supported layers', async () => {
    jest.spyOn(request, 'get').mockImplementation(() => ({
      statusCode: 200,
      body: gibsResponse
    }))

    const response = await getSupportedGibsLayers(false)
    expect(Object.keys(response)).toEqual(['MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'])
  })
})
