import { requestTimeout } from '../requestTimeout'

describe('requestTimeout', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    // Manage resetting ENV variables
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    // Restore any ENV variables overwritten in tests
    process.env = OLD_ENV
  })

  describe('when using the default threshold', () => {
    test('returns the lambda timeout minus the requested workload threshold', () => {
      const response = requestTimeout()

      expect(response).toEqual(20000)
    })
  })

  describe('when providing a threshold', () => {
    test('returns the lambda timeout minus the requested workload threshold', () => {
      const response = requestTimeout(5)

      expect(response).toEqual(25000)
    })
  })

  describe('when using a custom lambda timeout', () => {
    test('the timeout is adjusted correctly', () => {
      process.env.LAMBDA_TIMEOUT = 60

      const response = requestTimeout()

      expect(response).toEqual(50000)
    })
  })
})
