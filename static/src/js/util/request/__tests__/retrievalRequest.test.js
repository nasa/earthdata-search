import { v4 as uuidv4 } from 'uuid'

import RetrievalRequest from '../retrievalRequest'
import Request from '../request'

vi.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

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
    vi.spyOn(RetrievalRequest.prototype, 'handleUnauthorized').mockImplementation()
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

    const getMock = vi.spyOn(Request.prototype, 'get').mockImplementation()

    request.all()

    expect(getMock).toHaveBeenCalledTimes(1)
    expect(getMock).toHaveBeenCalledWith('retrievals')
  })
})

describe('RetrievalRequest#remove', () => {
  test('calls Request#delete', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    const deleteMock = vi.spyOn(Request.prototype, 'delete').mockImplementation()

    const projectId = '12345'
    request.remove(projectId)

    expect(deleteMock).toHaveBeenCalledTimes(1)
    expect(deleteMock).toHaveBeenCalledWith('retrievals/12345')
  })
})
