import PreferencesMetricsRequest from '../preferencesMetricsRequest'
import Request from '../../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('preferencesMetricsRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new PreferencesMetricsRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('preferencesMetricsRequest#all', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new PreferencesMetricsRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.all()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/preferences_metrics')
  })
})
