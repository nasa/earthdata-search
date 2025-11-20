import { v4 as uuidv4 } from 'uuid'

import RetrievalRequest from '../retrievalRequest'
import Request from '../request'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('RetrievalRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.edlToken).toEqual(token)
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

    request.all()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('retrievals')
  })
})

describe('RetrievalRequest#remove', () => {
  test('calls Request#delete', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    const deleteMock = jest.spyOn(Request.prototype, 'delete').mockImplementation()

    const projectId = '12345'
    request.remove(projectId)

    expect(deleteMock).toBeCalledTimes(1)
    expect(deleteMock).toBeCalledWith('retrievals/12345')
  })
})
