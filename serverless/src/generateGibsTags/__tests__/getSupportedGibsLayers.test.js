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
    const response = await getSupportedGibsLayers()

    expect(Object.keys(response)).not.toContain('ExcludedProjection_Value')
    expect(Object.keys(response)).not.toContain('MissingProjection_Value')
  })
})
