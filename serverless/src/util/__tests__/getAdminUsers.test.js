import AWS from 'aws-sdk'

import { getAdminUsers } from '../getAdminUsers'

describe('getAdminUsers', () => {
  test('fetches urs credentials from secrets manager', async () => {
    const secretsManagerData = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        SecretString: '["testuser1","testuser2"]'
      })
    })

    AWS.SecretsManager = jest.fn()
      .mockImplementationOnce(() => ({
        getSecretValue: secretsManagerData
      }))

    const response = await getAdminUsers()

    expect(response).toEqual(['testuser1', 'testuser2'])

    expect(secretsManagerData).toBeCalledTimes(1)
    expect(secretsManagerData.mock.calls[0]).toEqual([{
      SecretId: 'EDSC_Admins'
    }])
  })
})
