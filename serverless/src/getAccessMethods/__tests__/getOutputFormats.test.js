import nock from 'nock'

import { getOutputFormats } from '../getOutputFormats'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))
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

    const { supportedOutputFormats } = await getOutputFormats('S123456-EDSC', 'mockJwt')

    expect(supportedOutputFormats).toEqual([
      'HDF4',
      'NETCDF-3',
      'NETCDF-4',
      'BINARY',
      'ASCII'
    ])
  })

  test('catches and logs errors correctly', async () => {
    nock(/cmr/)
      .get(/concepts/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const response = await getOutputFormats('S123456-EDSC', 'mockJwt')

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(1)

    expect(consoleMock.mock.calls[0]).toEqual([
      'StatusCodeError (500): Test error message'
    ])

    expect(response).toEqual(null)
  })
})
