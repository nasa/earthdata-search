import RetrievalRequest from '../retrievalRequest'
import Request from '../../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('RetrievalRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('RetrievalRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(RetrievalRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new RetrievalRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('RetrievalRequest#all', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.all({ mock: 'params' })

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/retrievals', { mock: 'params' })
  })
})

describe('RetrievalRequest#fetch', () => {
  test('calls Request#get', () => {
    const request = new RetrievalRequest()

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    const id = '12345'
    request.fetch(id)

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/retrievals/12345')
  })
})

describe('RetrievalRequest#isAuthorized', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.isAuthorized()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/is_authorized')
  })
})

describe('RetrievalRequest#requeueOrder', () => {
  test('calls Request#post', () => {
    const request = new RetrievalRequest()

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { orderId: 1234 }
    request.requeueOrder(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('requeue_order', params)
  })
})
