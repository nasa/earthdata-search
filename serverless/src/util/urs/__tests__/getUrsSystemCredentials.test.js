import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { getUrsSystemCredentials } from '../getUrsSystemCredentials'

describe('getUrsSystemCredentials', () => {
  test('fetches urs credentials from secrets manager', async () => {
    const secretsManagerData = jest.fn().mockResolvedValue({
      SecretString: '{"username":"test","password":"password"}'
    })

    SecretsManagerClient.prototype.send = secretsManagerData

    const response = await getUrsSystemCredentials('prod')

    expect(response).toEqual({
      username: 'test',
      password: 'password'
    })

    expect(secretsManagerData).toBeCalledTimes(1)
    expect(secretsManagerData.mock.calls[0][0]).toBeInstanceOf(GetSecretValueCommand)
    expect(secretsManagerData.mock.calls[0][0].input).toEqual({
      SecretId: 'UrsSystemPasswordSecret_prod'
    })
  })
})
