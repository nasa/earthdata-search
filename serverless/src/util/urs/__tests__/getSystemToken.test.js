import nock from 'nock'

import { getSystemToken } from '../getSystemToken'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getUrsSystemCredentials from '../getUrsSystemCredentials'
import * as getEdlConfig from '../../getEdlConfig'

describe('getSystemToken', () => {
  test('correctly returns the cmr token when one is already set', async () => {
    jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
      username: 'edsc',
      password: 'mocked-password'
    }))
    jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
      client: {
        id: 'clientId'
      }
    }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    nock('http://example.com')
      .post('/legacy-services/rest/tokens.json')
      .reply(201, {
        token: {
          client_id: 'EDSC',
          id: '1234-abcd-5678-efgh',
          user_ip_address: '127.0.0.1',
          username: 'edsc'
        }
      })

    const tokenResponse = await getSystemToken()

    expect(tokenResponse).toEqual('1234-abcd-5678-efgh')
  })
})
