import { isDefaultPortal, authenticationEnabled } from '../portals'
import * as getApplicationConfig from '../../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('isDefaultPortal', () => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'edsc'
  }))

  test('returns true if the portalId matches the defaultPortal', () => {
    expect(isDefaultPortal('edsc')).toBeTruthy()
  })

  test('returns false if the portalId does not match the defaultPortal', () => {
    expect(isDefaultPortal('simple')).toBeFalsy()
  })
})

describe('authenticationEnabled', () => {
  test('returns true when authentication is enabled', () => {
    const portal = {
      features: {
        authentication: true
      }
    }

    expect(authenticationEnabled(portal)).toBeTruthy()
  })

  test('returns false when authentication is not enabled', () => {
    const portal = {
      features: {
        authentication: false
      }
    }

    expect(authenticationEnabled(portal)).toBeFalsy()
  })
})
