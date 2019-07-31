import { getClientId } from '../config'

const OLD_ENV = process.env

beforeEach(() => {
  process.env = OLD_ENV
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('getClientId', () => {
  test('returns the clientId object for the given environment', () => {
    process.env.NODE_ENV = 'production'

    const clientId = {
      background: 'eed-edsc-prod-serverless-background',
      client: 'eed-edsc-prod-serverless-client',
      lambda: 'eed-edsc-prod-serverless-lambda'
    }
    expect(getClientId('prod')).toEqual(clientId)
  })

  test('returns the clientId object for test', () => {
    process.env.NODE_ENV = 'test'

    const clientId = {
      background: 'eed-edsc-test-serverless-background',
      client: 'eed-edsc-test-serverless-client',
      lambda: 'eed-edsc-test-serverless-lambda'
    }

    expect(getClientId('sit')).toEqual(clientId)
  })

  test('returns the clientId object for development', () => {
    process.env.NODE_ENV = 'development'

    const clientId = {
      background: 'eed-edsc-dev-serverless-background',
      client: 'eed-edsc-dev-serverless-client',
      lambda: 'eed-edsc-dev-serverless-lambda'
    }

    expect(getClientId('sit')).toEqual(clientId)
  })
})
