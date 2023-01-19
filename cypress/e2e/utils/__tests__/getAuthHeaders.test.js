import { getAuthHeaders } from '../getAuthHeaders'

describe('getAuthHeaders', () => {
  test('builds an object containing standard auth headers', () => {
    expect(Object.keys(getAuthHeaders()))
      .toEqual(['jwt-token'])
  })
})
