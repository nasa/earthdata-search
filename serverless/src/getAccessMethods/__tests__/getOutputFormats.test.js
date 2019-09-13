import nock from 'nock'

import { getOutputFormats } from '../getOutputFormats'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getOutputFormats', () => {
  test('fetches UMM-S record from CMR and returns the SupportedOutputFormats', async () => {
    nock(/cmr/)
      .get(/concepts/)
      .reply(200, {
        ServiceOptions: {
          SupportedOutputFormats: [
            'HDF4',
            'NETCDF-3',
            'NETCDF-4',
            'BINARY',
            'ASCII'
          ]
        }
      })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))

    const { supportedOutputFormats } = await getOutputFormats('S123456-EDSC', 'mockJwt')

    expect(supportedOutputFormats).toEqual([
      'HDF4',
      'NETCDF-3',
      'NETCDF-4',
      'BINARY',
      'ASCII'
    ])
  })
})
