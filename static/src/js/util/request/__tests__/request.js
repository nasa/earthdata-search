import Request from '../request'

describe('Request#constructor', () => {
  test('throws an error when no baseUrl value is provided', () => {
    expect(() => {
      Request()
    }).toThrow()
  })
})
