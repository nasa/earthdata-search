import decodeId from '../handler'

const OLD_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()

  // Manage resetting ENV variables
  jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('decodeId', () => {
  test('correctly returns a json response', () => {
    process.env.obfuscationSpin = 1000

    const response = decodeId({
      queryStringParameters: {
        obfuscated_id: 100
      }
    }, {})

    const { body, statusCode } = response

    const responseObj = {
      id: 6045748678
    }

    expect(body).toEqual(JSON.stringify(responseObj))
    expect(statusCode).toEqual(200)
  })
})
