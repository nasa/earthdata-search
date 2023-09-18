import { v4 as uuidv4 } from 'uuid'

import ColorMapRequest from '../colorMapRequest'
import Request from '../request'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ColorMapRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new ColorMapRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('ColorMap#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(ColorMapRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new ColorMapRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('ColorMap#getColorMap', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new ColorMapRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.getColorMap('AMSR2_Cloud_Liquid_Water_Day')

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('colormaps/AMSR2_Cloud_Liquid_Water_Day')
  })
})
