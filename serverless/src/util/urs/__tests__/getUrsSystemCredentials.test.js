import AWS from 'aws-sdk'

import { getUrsSystemCredentials } from '../getUrsSystemCredentials'

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

    const response = await getUrsSystemCredentials('prod')

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
