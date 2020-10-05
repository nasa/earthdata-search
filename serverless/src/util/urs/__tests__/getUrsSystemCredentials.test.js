import AWS from 'aws-sdk'

import { getUrsSystemCredentials } from '../getUrsSystemCredentials'

import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'

describe('getUrsSystemCredentials', () => {
  test('fetches urs credentials from secrets manager', async () => {
    const secretsManagerData = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        SecretString: '{"username":"test","password":"password"}'
      })
    })

    AWS.SecretsManager = jest.fn()
      .mockImplementationOnce(() => ({
        getSecretValue: secretsManagerData
      }))

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    const response = await getUrsSystemCredentials()

    expect(response).toEqual({
      username: 'test',
      password: 'password'
    })

    expect(secretsManagerData).toBeCalledTimes(1)
    expect(secretsManagerData.mock.calls[0]).toEqual([{
      SecretId: 'UrsSystemPasswordSecret_prod'
    }])
  })
})
