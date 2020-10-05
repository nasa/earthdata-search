import * as validateToken from '../../util/authorizer/validateToken'

import edlOptionalAuthorizer from '../handler'

import { getEnvironmentConfig } from '../../../../sharedUtils/config'

describe('edlOptionalAuthorizer', () => {
  describe('when the logged in user is an admin', () => {
    test('returns a valid policy', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => 'testuser')

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        headers: {
          Authorization: `Bearer: ${jwtToken}`
        }
      }

      const response = await edlOptionalAuthorizer(event, {})

      expect(response).toEqual({
        context: {
          jwtToken
        },
        principalId: 'testuser'
      })
    })
  })

  describe('when the supplied jwtToken is empty', () => {
    describe('when the resource path requires authentication', () => {
      test('returns an anonymous policy', async () => {
        jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => false)

        const event = {
          headers: {
            Authorization: ''
          },
          requestContext: {
            resourcePath: '/authRequiredEndpoint'
          }
        }

        await expect(
          edlOptionalAuthorizer(event, {})
        ).rejects.toThrow('Unauthorized')
      })
    })

    test('returns an anonymous policy', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => false)

      const event = {
        headers: {
          Authorization: ''
        },
        requestContext: {
          resourcePath: '/autocomplete'
        }
      }

      const response = await edlOptionalAuthorizer(event)

      expect(response).toEqual({
        principalId: 'anonymous'
      })
    })
  })

  describe('when the supplied jwtToken is invalid', () => {
    test('returns unauthorized', async () => {
      jest.spyOn(validateToken, 'validateToken').mockImplementationOnce(() => false)

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        headers: {
          Authorization: `Bearer: ${jwtToken}`
        }
      }

      await expect(
        edlOptionalAuthorizer(event, {})
      ).rejects.toThrow('Unauthorized')
    })
  })
})
