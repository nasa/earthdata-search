import ShapefileRequest from '../shapefileRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ShapefileRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const request = new ShapefileRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.lambda).toBeTruthy()
  })
})

describe('ShapefileRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new ShapefileRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'file',
      'filename',
      'auth_token'
    ])
  })
})

describe('ShapefileRequest#save', () => {
  test('calls Request#post', () => {
    const request = new ShapefileRequest()

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { mock: 'data' }
    request.save(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('save_shapefile', params)
  })
})
