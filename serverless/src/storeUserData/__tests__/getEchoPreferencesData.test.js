import request from 'request-promise'
import { getEchoPreferencesData } from '../getEchoPreferencesData'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getClientId from '../../../../sharedUtils/getClientId'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getEchoPreferencesData', () => {
  test('correctly requests a users data from urs', async () => {
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ echoRestRoot: 'http://echorest.example.com' }))
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
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://echorest.example.com' }))

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
