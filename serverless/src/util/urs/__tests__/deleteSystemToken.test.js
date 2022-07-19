import nock from 'nock'

import { deleteSystemToken } from '../deleteSystemToken'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getUrsSystemCredentials from '../getUrsSystemCredentials'

describe('deleteSystemToken', () => {
  test('correctly returns the cmr token when one is already set', async () => {
    jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
      username: 'edsc',
      password: 'mocked-password'
    }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://example.com' }))

    nock('http://example.com')
      .matchHeader('Authorization', 'Basic ZWRzYzptb2NrZWQtcGFzc3dvcmQ=')
      .post('/api/users/revoke_token?token=1234-abcd-5678-efgh')
      .reply(200, {})

    const tokenResponse = await deleteSystemToken('1234-abcd-5678-efgh')

    expect(tokenResponse).toEqual(undefined)
  })
})
