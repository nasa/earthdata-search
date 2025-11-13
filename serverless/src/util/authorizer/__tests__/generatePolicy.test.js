import { generatePolicy } from '../generatePolicy'

describe('generatePolicy', () => {
  describe('when a jwtToken is provided', () => {
    test('policy includes the provided token', () => {
      const response = generatePolicy({
        earthdataEnvironment: 'sit',
        effect: {},
        jwtToken: 'jwtToken',
        resource: 'test-resource',
        userId: 1,
        username: 'testuser'
      })

      expect(response).toEqual({
        context: {
          earthdataEnvironment: 'sit',
          jwtToken: 'jwtToken',
          userId: 1,
          username: 'testuser'
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
      const response = generatePolicy({
        effect: {},
        resource: 'test-resource',
        username: 'testuser'
      })

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
      const response = generatePolicy({
        effect: {},
        username: 'testuser'
      })

      expect(response).toEqual({
        principalId: 'testuser'
      })
    })
  })

  describe('when no effect is provided', () => {
    test('policy does not include a policy document', () => {
      const response = generatePolicy({
        resource: 'test-resource',
        username: 'testuser'
      })

      expect(response).toEqual({
        principalId: 'testuser'
      })
    })
  })
})
