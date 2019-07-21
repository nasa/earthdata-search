import { getUsernameFromToken } from '../getUsernameFromToken'

describe('getUsernameFromToken', () => {
  test('retrieves the username from the endpoint field', () => {
    const token = {
      endpoint: '/api/users/testuser'
    }

    expect(getUsernameFromToken(token)).toEqual('testuser')
  })
})
