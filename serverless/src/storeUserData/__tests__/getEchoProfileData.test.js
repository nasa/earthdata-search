import nock from 'nock'

import * as getClientId from '../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { getEchoProfileData } from '../getEchoProfileData'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getEchoProfileData', () => {
  test('correctly requests a users data from echo rest', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ lambda: 'eed-edsc-test-serverless-lambda' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer fake.access.token')
      .matchHeader('Client-Id', 'eed-edsc-test-serverless-lambda')
      .get(/users/)
      .reply(200, {
        first_name: 'test',
        last_name: 'user'
      })

    const ursData = await getEchoProfileData('fake.access.token')

    expect(ursData).toEqual({
      first_name: 'test',
      last_name: 'user'
    })
  })
})
