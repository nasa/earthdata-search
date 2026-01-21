import nock from 'nock'

import { getUrsUserData } from '../getUrsUserData'

import * as getClientId from '../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getEdlConfig from '../../util/getEdlConfig'

describe('getUrsUserData', () => {
  test('correctly requests a users data from urs', async () => {
    vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://urs.example.com' }))
    vi.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ background: 'eed-edsc-test-serverless-background' }))

    vi.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
      client: {
        id: 'clientId'
      }
    }))

    nock(/urs/)
      .matchHeader('Authorization', 'Bearer fake.access.token')
      .matchHeader('Client-Id', 'eed-edsc-test-serverless-background')
      .get(/api\/users\/test_user/)
      .reply(200, {
        user: {
          uid: 'test_user',
          first_name: 'test',
          last_name: 'user'
        }
      })

    const ursData = await getUrsUserData('test_user', 'fake.access.token')

    expect(ursData).toEqual({
      user: {
        uid: 'test_user',
        first_name: 'test',
        last_name: 'user'
      }
    })
  })
})
