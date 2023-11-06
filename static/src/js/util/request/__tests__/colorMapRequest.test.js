import ColorMapRequest from '../colorMapRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ColorMapRequest#constructor', () => {
  test('sets the default values correctly', () => {
    const request = new ColorMapRequest()

    expect(request.baseUrl).toEqual('http://localhost:3000')
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
