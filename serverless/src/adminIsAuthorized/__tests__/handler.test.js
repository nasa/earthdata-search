import adminIsAuthorized from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('adminIsAuthorized', () => {
  test('correctly returns a json response', async () => {
    const response = await adminIsAuthorized({}, {})

    const { body, statusCode } = response

    const responseObj = {
      authorized: true
    }

    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })
})
