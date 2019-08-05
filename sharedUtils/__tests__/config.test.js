import { getClientId } from '../config'
import * as cmrEnv from '../cmrEnv'

const OLD_ENV = process.env

beforeEach(() => {
  process.env = OLD_ENV
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('getClientId', () => {
  test('returns the clientId object for the prod environment', () => {
    process.env.NODE_ENV = 'production'

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    const clientId = {
      background: 'eed-edsc-prod-serverless-background',
      client: 'eed-edsc-prod-serverless-client',
      lambda: 'eed-edsc-prod-serverless-lambda'
    }
    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for the uat environment', () => {
    process.env.NODE_ENV = 'production'

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'uat')

    const clientId = {
      background: 'eed-edsc-uat-serverless-background',
      client: 'eed-edsc-uat-serverless-client',
      lambda: 'eed-edsc-uat-serverless-lambda'
    }
    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for the sit environment', () => {
    process.env.NODE_ENV = 'production'

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'sit')

    const clientId = {
      background: 'eed-edsc-sit-serverless-background',
      client: 'eed-edsc-sit-serverless-client',
      lambda: 'eed-edsc-sit-serverless-lambda'
    }
    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for test', () => {
    process.env.NODE_ENV = 'test'

    const clientId = {
      background: 'eed-edsc-test-serverless-background',
      client: 'eed-edsc-test-serverless-client',
      lambda: 'eed-edsc-test-serverless-lambda'
    }

    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for development', () => {
    process.env.NODE_ENV = 'development'

    const clientId = {
      background: 'eed-edsc-dev-serverless-background',
      client: 'eed-edsc-dev-serverless-client',
      lambda: 'eed-edsc-dev-serverless-lambda'
    }

    expect(getClientId()).toEqual(clientId)
  })
})
