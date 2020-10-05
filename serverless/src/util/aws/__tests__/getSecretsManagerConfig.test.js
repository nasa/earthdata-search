import { getSecretsManagerConfig } from '../getSecretsManagerConfig'

describe('getSecretsManagerConfig', () => {
  test('returns the app secrets manager configuration', () => {
    expect(getSecretsManagerConfig()).toEqual({
      apiVersion: '2017-10-17',
      region: 'us-east-1'
    })
  })
})
