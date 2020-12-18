import nock from 'nock'

import * as getClientId from '../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { getEchoPreferencesData } from '../getEchoPreferencesData'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getEchoPreferencesData', () => {
  test('correctly requests a users data from urs', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ lambda: 'eed-edsc-test-serverless-lambda' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer fake.access.token')
      .matchHeader('Client-Id', 'eed-edsc-test-serverless-lambda')
      .get(/preferences/)
      .reply(200, {
        general_contact: {
          first_name: 'test',
          last_name: 'user'
        }
      })

    const ursData = await getEchoPreferencesData('test_user', 'fake.access.token')

    expect(ursData).toEqual({
      general_contact: {
        first_name: 'test',
        last_name: 'user'
      }
    })
  })
})
