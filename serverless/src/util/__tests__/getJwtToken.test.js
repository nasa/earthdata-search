import { getJwtToken } from '../getJwtToken'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('util#getJwtToken', () => {
  test('correctly returns the JWT token when one is already set', () => {
    const token = '123.456.789'

    const event = {
      requestContext: {
        authorizer: {
          jwtToken: token
        }
      }
    }

    expect(getJwtToken(event)).toEqual('123.456.789')
  })
})
