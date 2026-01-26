import jwt from 'jsonwebtoken'

import { validateToken } from '../validateToken'

vi.mock('jwks-rsa', () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue({
    getSigningKey: vi.fn().mockResolvedValue({
      getPublicKey: vi.fn().mockReturnValue('PUBLIC_KEY')
    })
  })
}))

describe('validateToken', () => {
  describe('when there is no token', () => {
    test('returns false', async () => {
      const result = await validateToken(null, 'sit')

      expect(result).toEqual(false)
    })
  })

  describe('when the provided token is invalid', () => {
    test('returns false', async () => {
      vi.spyOn(jwt, 'verify').mockImplementation((token, secret, options, callback) => {
        callback('Mock Error')
      })

      await expect(validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlciIsImlhdCI6MTU3ODQzMzQ3Nn0.T8pJ9sbgabjPISwMllvQdL4Bl7ng5pkgpS2Tjwij148', 'sit')).rejects.toThrow('Mock Error')
    })
  })

  describe('when the provided token is valid', () => {
    describe('when the token is a SIT token', () => {
      test('returns the username associated with the token', async () => {
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, options, callback) => {
          callback(undefined, { username: 'testuser' })
        })

        const { username } = await validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlciIsImlhdCI6MTU3ODQzMzQ3Nn0.T8pJ9sbgabjPISwMllvQdL4Bl7ng5pkgpS2Tjwij148', 'sit')

        expect(username).toEqual('testuser')
      })
    })
  })

  describe('when the token is a UAT token', () => {
    test('returns the username associated with the token', async () => {
      vi.spyOn(jwt, 'verify').mockImplementation((token, secret, options, callback) => {
        callback(undefined, { username: 'testuser' })
      })

      const { username } = await validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlciIsImlhdCI6MTU3ODQzMzQ3Nn0.T8pJ9sbgabjPISwMllvQdL4Bl7ng5pkgpS2Tjwij148', 'uat')

      expect(username).toEqual('testuser')
    })
  })

  describe('when the token is a PROD token', () => {
    test('returns the username associated with the token', async () => {
      vi.spyOn(jwt, 'verify').mockImplementation((token, secret, options, callback) => {
        callback(undefined, { username: 'testuser' })
      })

      const { username } = await validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlciIsImlhdCI6MTU3ODQzMzQ3Nn0.T8pJ9sbgabjPISwMllvQdL4Bl7ng5pkgpS2Tjwij148', 'prod')

      expect(username).toEqual('testuser')
    })
  })
})
