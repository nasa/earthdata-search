import Request from '../request'
import PreferencesRequest from '../preferencesRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('PreferencesRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new PreferencesRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('PreferencesRequest#update', () => {
  test('calls Request#post', () => {
    const token = '123'
    const request = new PreferencesRequest(token)

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { mock: 'data' }
    request.update(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('preferences', params)
  })
})

describe('PreferencesRequest#transformRequest', () => {
  test('returns params and sets headers', () => {
    const token = '123'
    const request = new PreferencesRequest(token)

    const data = {
      preferences: {
        panelState: 'default'
      }
    }
    const headers = {}
    const result = request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer 123'
    }))

    const parsedData = JSON.parse(result)
    expect(parsedData).toEqual({
      params: {
        preferences: {
          panelState: 'default'
        }
      },
      requestId: expect.any(String)
    })
  })
})
