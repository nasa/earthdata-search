import ShapefileRequest from '../shapefileRequest'
import Request from '../request'

describe('ShapefileRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const request = new ShapefileRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.lambda).toBeTruthy()
  })
})

describe('ShapefileRequest#fetch', () => {
  test('calls Request#get', () => {
    const request = new ShapefileRequest()

    const getMock = vi.spyOn(Request.prototype, 'get').mockImplementation()

    const id = 123
    request.fetch(id)

    expect(getMock).toHaveBeenCalledTimes(1)
    expect(getMock).toHaveBeenCalledWith('shapefiles/123')
  })
})

describe('ShapefileRequest#save', () => {
  test('calls Request#post', () => {
    const request = new ShapefileRequest()

    const postMock = vi.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { mock: 'data' }
    request.save(params)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('shapefiles', params)
  })
})
