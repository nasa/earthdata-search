import * as validateToken from '../../util/authorizer/validateToken'
import edlAuthorizer from '../handler'
import { getEnvironmentConfig } from '../../../../sharedUtils/config'

describe('edlAuthorizer', () => {
  describe('when the logged in user is an admin', () => {
    test('returns a valid policy', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => 'testuser')

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        authorizationToken: `Bearer: ${jwtToken}`
      }

      const response = await edlAuthorizer(event, {})

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

      await expect(
        edlAuthorizer({}, {})
      ).rejects.toThrow('Unauthorized')
    })
  })
})
