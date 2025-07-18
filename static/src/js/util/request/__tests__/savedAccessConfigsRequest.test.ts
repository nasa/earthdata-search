import SavedAccessConfigsRequest from '../savedAccessConfigsRequest'

describe('SavedAccessConfigsRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new SavedAccessConfigsRequest(token, 'prod')

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('saved_access_configs')
  })
})
