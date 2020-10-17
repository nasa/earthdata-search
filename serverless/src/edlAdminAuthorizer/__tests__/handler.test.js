import * as getAdminUsers from '../../util/getAdminUsers'
import * as validateToken from '../../util/authorizer/validateToken'
import edlAdminAuthorizer from '../handler'
import { getEnvironmentConfig } from '../../../../sharedUtils/config'

describe('edlAdminAuthorizer', () => {
  describe('when the logged in user is an admin', () => {
    test('returns a valid policy', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => 'testuser')
      jest.spyOn(getAdminUsers, 'getAdminUsers').mockImplementationOnce(() => ['testuser'])

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        authorizationToken: `Bearer: ${jwtToken}`
      }

      const response = await edlAdminAuthorizer(event, {})

      expect(response).toEqual({
        context: {
          jwtToken
        },
        principalId: 'testuser'
      })
    })
  })

  describe('when the supplied jwtToken is invalid', () => {
    test('returns unauthorized', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => false)
      jest.spyOn(getAdminUsers, 'getAdminUsers').mockImplementationOnce(() => ['adminuser'])

      await expect(
        edlAdminAuthorizer({}, {})
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('when the logged in user is not an admin', () => {
    test('returns unauthorized', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => 'testuser')
      jest.spyOn(getAdminUsers, 'getAdminUsers').mockImplementationOnce(() => ['adminuser'])

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        authorizationToken: `Bearer: ${jwtToken}`
      }

      await expect(
        edlAdminAuthorizer(event, {})
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('when an error is returned while retrieving the admin user list', () => {
    test('returns unauthorized', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => 'testuser')
      jest.spyOn(getAdminUsers, 'getAdminUsers').mockImplementationOnce(() => (
        new Promise((resolve, reject) => reject(new Error('Unkown Error')))
      ))

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        authorizationToken: `Bearer: ${jwtToken}`
      }

      await expect(
        edlAdminAuthorizer(event, {})
      ).rejects.toThrow('Unauthorized')
    })
  })
})
