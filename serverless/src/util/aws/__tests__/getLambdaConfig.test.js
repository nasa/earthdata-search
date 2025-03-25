import { getLambdaConfig } from '../getLambdaConfig'

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

describe('util#getLambdaConfig', () => {
  test('returns an endpoint when NODE_ENV is development', () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.NODE_ENV = 'development'

    const lambdaConfig = getLambdaConfig()

    expect(Object.keys(lambdaConfig)).toContain('endpoint')
  })
})

describe('util#getLambdaConfig', () => {
  test('does not return an endpoint when NODE_ENV is not development', () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.NODE_ENV = 'test'

    const lambdaConfig = getLambdaConfig()

    expect(Object.keys(lambdaConfig)).not.toContain('endpoint')
  })
})
