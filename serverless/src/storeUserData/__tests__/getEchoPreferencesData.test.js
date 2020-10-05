import request from 'request-promise'

import * as getClientId from '../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getEdlConfig from '../../util/getEdlConfig'

import { getEchoPreferencesData } from '../getEchoPreferencesData'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ echoRestRoot: 'http://echorest.example.com' }))
})

describe('getEchoPreferencesData', () => {
  test('correctly requests a users data from urs', async () => {
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ lambda: 'eed-edsc-test-serverless-lambda' }))

    const ursGetMock = jest.spyOn(request, 'get')
      .mockImplementationOnce(() => jest.fn())

    await getEchoPreferencesData('test_user', 'fake.access.token')

    expect(ursGetMock).toBeCalledTimes(1)
    expect(ursGetMock).toBeCalledWith({
      uri: 'http://echorest.example.com/users/test_user/preferences.json',
      headers: {
        'Echo-Token': 'fake.access.token:clientId',
        'Client-Id': 'eed-edsc-test-serverless-lambda'
      },
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly returns the users data', async () => {
    jest.spyOn(request, 'get')
      .mockImplementationOnce(() => ({
        body: {
          general_contact: {
            first_name: 'test',
            last_name: 'user'
          }
        }
      }))

    const ursData = await getEchoPreferencesData('test_user', 'fake.access.token')

    expect(ursData).toEqual({
      general_contact: {
        first_name: 'test',
        last_name: 'user'
      }
    })
  })
})
