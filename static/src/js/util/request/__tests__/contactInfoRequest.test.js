import Request from '../request'
import ContactInfoRequest from '../contactInfoRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ContactInfoRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new ContactInfoRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('ContactInfoRequest#fetch', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new ContactInfoRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.fetch()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('contact_info')
  })
})

describe('ContactInfoRequest#updateNotificationLevel', () => {
  test('calls Request#post', () => {
    const token = '123'
    const request = new ContactInfoRequest(token)

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const data = { mock: 'data' }
    request.updateNotificationLevel(data)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('contact_info', data)
  })
})
