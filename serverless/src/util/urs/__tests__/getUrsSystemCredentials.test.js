import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { getUrsSystemCredentials } from '../getUrsSystemCredentials'

describe('getUrsSystemCredentials', () => {
  test('fetches urs credentials from secrets manager', async () => {
    const mockSecretValue = '{"username":"test","password":"password"}'
    const secretsManagerData = {
      send: jest.fn().mockResolvedValue({
        SecretString: mockSecretValue
      })
    }

    jest.mock("@aws-sdk/client-secrets-manager", () => {
      return {
        SecretsManagerClient: jest.fn(() => secretsManagerData),
        GetSecretValueCommand: jest.requireActual("@aws-sdk/client-secrets-manager").GetSecretValueCommand
      }
    })

    const response = await getUrsSystemCredentials('prod')

    expect(response).toEqual({
      username: 'test',
      password: 'password'
    })

    expect(secretsManagerData.send).toBeCalledTimes(1)
    expect(secretsManagerData.send.mock.calls[0][0]).toBeInstanceOf(GetSecretValueCommand)
    expect(secretsManagerData.send.mock.calls[0][0].input).toEqual({
      SecretId: 'UrsSystemPasswordSecret_prod'
    })
  })
})
