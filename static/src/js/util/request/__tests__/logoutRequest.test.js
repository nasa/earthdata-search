import LogoutRequest from '../logoutRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('LogoutRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new LogoutRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('LogoutRequest#logout', () => {
  test('calls Request#delete', () => {
    const token = '123'
    const request = new LogoutRequest(token)

    const deleteMock = jest.spyOn(Request.prototype, 'delete').mockImplementation()

    request.logout()

    expect(deleteMock).toBeCalledTimes(1)
    expect(deleteMock).toBeCalledWith('logout')
  })
})
