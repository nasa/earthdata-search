import { getClientId } from '../getClientId'
import * as config from '../config'

describe('getClientId', () => {
  test('returns the clientId object for the prod environment', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      defaultPortal: 'edsc',
      clientId: {
        background: 'eed-PORTAL-ENV-serverless-background',
        client: 'eed-PORTAL-ENV-serverless-client',
        lambda: 'eed-PORTAL-ENV-serverless-lambda'
      }
    }))

    const clientId = {
      background: 'eed-edsc-prod-serverless-background',
      client: 'eed-edsc-prod-serverless-client',
      lambda: 'eed-edsc-prod-serverless-lambda'
    }
    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for the uat environment', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'uat',
      defaultPortal: 'edsc',
      clientId: {
        background: 'eed-PORTAL-ENV-serverless-background',
        client: 'eed-PORTAL-ENV-serverless-client',
        lambda: 'eed-PORTAL-ENV-serverless-lambda'
      }
    }))

    const clientId = {
      background: 'eed-edsc-uat-serverless-background',
      client: 'eed-edsc-uat-serverless-client',
      lambda: 'eed-edsc-uat-serverless-lambda'
    }
    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for the sit environment', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'sit',
      defaultPortal: 'edsc',
      clientId: {
        background: 'eed-PORTAL-ENV-serverless-background',
        client: 'eed-PORTAL-ENV-serverless-client',
        lambda: 'eed-PORTAL-ENV-serverless-lambda'
      }
    }))

    const clientId = {
      background: 'eed-edsc-sit-serverless-background',
      client: 'eed-edsc-sit-serverless-client',
      lambda: 'eed-edsc-sit-serverless-lambda'
    }
    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for test', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'test',
      defaultPortal: 'edsc',
      clientId: {
        background: 'eed-PORTAL-ENV-serverless-background',
        client: 'eed-PORTAL-ENV-serverless-client',
        lambda: 'eed-PORTAL-ENV-serverless-lambda'
      }
    }))

    const clientId = {
      background: 'eed-edsc-test-serverless-background',
      client: 'eed-edsc-test-serverless-client',
      lambda: 'eed-edsc-test-serverless-lambda'
    }

    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for test when in CI', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      ciMode: true,
      defaultPortal: 'edsc',
      clientId: {
        background: 'eed-PORTAL-ENV-serverless-background',
        client: 'eed-PORTAL-ENV-serverless-client',
        lambda: 'eed-PORTAL-ENV-serverless-lambda'
      }
    }))

    const clientId = {
      background: 'eed-edsc-test-serverless-background',
      client: 'eed-edsc-test-serverless-client',
      lambda: 'eed-edsc-test-serverless-lambda'
    }

    expect(getClientId()).toEqual(clientId)
  })

  test('returns the clientId object for development', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc',
      clientId: {
        background: 'eed-PORTAL-ENV-serverless-background',
        client: 'eed-PORTAL-ENV-serverless-client',
        lambda: 'eed-PORTAL-ENV-serverless-lambda'
      }
    }))

    const clientId = {
      background: 'eed-edsc-dev-serverless-background',
      client: 'eed-edsc-dev-serverless-client',
      lambda: 'eed-edsc-dev-serverless-lambda'
    }

    expect(getClientId()).toEqual(clientId)
  })
})
