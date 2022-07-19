import nock from 'nock'

import { getSystemToken } from '../getSystemToken'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getUrsSystemCredentials from '../getUrsSystemCredentials'

describe('getSystemToken', () => {
  test('correctly returns the cmr token when one is already set', async () => {
    jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
      username: 'edsc',
      password: 'mocked-password'
    }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://example.com' }))

    nock('http://example.com')
      .matchHeader('Authorization', 'Basic ZWRzYzptb2NrZWQtcGFzc3dvcmQ=')
      .post('/api/users/token')
      .reply(200, {
        access_token: '1234-abcd-5678-efgh'
      })

    const tokenResponse = await getSystemToken()

    expect(tokenResponse).toEqual('1234-abcd-5678-efgh')
  })
})
