import { generatePolicy } from '../generatePolicy'

describe('generatePolicy', () => {
  describe('when a jwtToken is provided', () => {
    test('policy includes the provided token', () => {
      const response = generatePolicy('testuser', 'jwtToken', {}, 'test-resource')

      expect(response).toEqual({
        context: {
          jwtToken: 'jwtToken'
        },
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: {},
              Resource: 'test-resource'
            }
          ],
          Version: '2012-10-17'
        },
        principalId: 'testuser'
      })
    })
  })

  describe('when a jwtToken is not provided', () => {
    test('policy does not include the token', () => {
      const response = generatePolicy('testuser', undefined, {}, 'test-resource')

      expect(response).toEqual({
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: {},
              Resource: 'test-resource'
            }
          ],
          Version: '2012-10-17'
        },
        principalId: 'testuser'
      })
    })
  })

  describe('when no resource is provided', () => {
    test('policy does not include a policy document', () => {
      const response = generatePolicy('testuser', undefined, {}, undefined)

      expect(response).toEqual({
        principalId: 'testuser'
      })
    })
  })

  describe('when no effect is provided', () => {
    test('policy does not include a policy document', () => {
      const response = generatePolicy('testuser', undefined, undefined, 'test-resource')

      expect(response).toEqual({
        principalId: 'testuser'
      })
    })
  })
})
