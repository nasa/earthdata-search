import * as getApplicationConfig from '../../../../../sharedUtils/config'

import { getEarthdataEnvironment } from '../earthdataEnvironment'

describe('getEarthdataEnvironment', () => {
  describe('when the state does not contain the earthdata env key', () => {
    test('returns the value from the static config', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod'
      }))

      const response = getEarthdataEnvironment({ authToken: 'auth-token' })

      expect(response).toEqual('prod')
    })
  })

  describe('when the state does contain the earthdata env key', () => {
    test('returns the value from the header', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod'
      }))

      const response = getEarthdataEnvironment({ earthdataEnvironment: 'uat' })

      expect(response).toEqual('uat')
    })
  })

  describe('when the URL contains the earthdata env key', () => {
    test('returns the value from the URL', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod'
      }))

      const response = getEarthdataEnvironment({
        earthdataEnvironment: 'uat',
        router: {
          location: {
            search: '?ee=prod'
          }
        }
      })

      expect(response).toEqual('prod')
    })
  })
})
