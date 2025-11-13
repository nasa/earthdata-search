import { getAuthorizerContext } from '../getAuthorizerContext'

describe('util#getAuthorizerContext', () => {
  test('correctly returns the JWT token when one is already set', () => {
    const token = '123.456.789'

    const event = {
      requestContext: {
        authorizer: {
          jwtToken: token
        }
      }
    }

    expect(getAuthorizerContext(event)).toEqual({
      jwtToken: token
    })
  })
})
