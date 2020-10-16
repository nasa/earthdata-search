import * as getApplicationConfig from '../../../../sharedUtils/config'

import { determineEarthdataEnvironment } from '../determineEarthdataEnvironment'

describe('determineEarthdataEnvironment', () => {
  describe('when no headers are provided', () => {
    test('returns the value from the static config', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod'
      }))

      const response = determineEarthdataEnvironment()

      expect(response).toEqual('prod')
    })
  })

  describe('when headers are provided', () => {
    describe('when the headers do not contain the earthdata env header', () => {
      test('returns the value from the static config', () => {
        jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
          env: 'prod'
        }))

        const response = determineEarthdataEnvironment({ random: 'header' })

        expect(response).toEqual('prod')
      })
    })

    describe('when the headers do contain the earthdata env header', () => {
      test('returns the value from the header', () => {
        jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
          env: 'prod'
        }))

        const response = determineEarthdataEnvironment({ 'Earthdata-ENV': 'uat' })

        expect(response).toEqual('uat')
      })
    })
  })
})
