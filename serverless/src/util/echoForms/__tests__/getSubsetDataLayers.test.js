import { loadedEchoFormXml } from './mocks'
import { getSubsetDataLayers } from '../getSubsetDataLayers'

describe('util#getSubsetDataLayers', () => {
  test('correctly discovers the correct fields from the provided xml', () => {
    const subsetDataLayers = getSubsetDataLayers(loadedEchoFormXml)

    expect(subsetDataLayers).toEqual({
      SUBSET_DATA_LAYERS: '/MI1B2E/BlueBand,/MI1B2E/BRF Conversion Factors,/MI1B2E/GeometricParameters,/MI1B2E/NIRBand,/MI1B2E/RedBand'
    })
  })
})
