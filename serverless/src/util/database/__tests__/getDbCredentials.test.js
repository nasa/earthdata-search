import AWS from 'aws-sdk'

import { getDbCredentials } from '../getDbCredentials'

import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'

const OLD_ENV = process.env

describe('getDbCredentials', () => {
  beforeEach(() => {
    // Manage resetting ENV variables
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    // Restore any ENV variables overwritten in tests
    process.env = OLD_ENV
  })

  test('fetches urs credentials from secrets manager', async () => {
    process.env.configSecretId = 'test-DbPasswordSecret'

    const secretsManagerData = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        SecretString: '{"username":"fake-username", "password":"fake-pw"}'
      })
    })

    AWS.SecretsManager = jest.fn()
      .mockImplementationOnce(() => ({
        getSecretValue: secretsManagerData
      }))

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    const response = await getDbCredentials()

    expect(response).toEqual({
      username: 'fake-username',
      password: 'fake-pw'
    })

    expect(secretsManagerData).toBeCalledTimes(1)

    expect(secretsManagerData.mock.calls[0]).toEqual([{
      SecretId: 'test-DbPasswordSecret'
    }])
  })
})
