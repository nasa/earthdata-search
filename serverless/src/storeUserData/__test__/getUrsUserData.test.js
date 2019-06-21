import request from 'request-promise'
import { getUrsUserData } from '../getUrsUserData'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getUrsUserData', () => {
  test('correctly requests a users data from urs', async () => {
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://urs.example.com' }))

    const ursGetMock = jest.spyOn(request, 'get')
      .mockImplementationOnce(() => jest.fn())

    getUrsUserData('test_user', 'fake.access.token')

    expect(ursGetMock).toBeCalledTimes(1)
    expect(ursGetMock).toBeCalledWith({
      uri: 'http://urs.example.com/api/users/test_user?client_id=clientId',
      headers: {
        Authorization: 'Bearer fake.access.token'
      },
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly returns the users data', async () => {
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://urs.example.com' }))

    jest.spyOn(request, 'get')
      .mockImplementationOnce(() => ({
        body: {
          user: {
            uid: 'test_user',
            first_name: 'test',
            last_name: 'user'
          }
        }
      }))

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
