import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

import {
  decodeEarthdataEnvironment,
  encodeEarthdataEnvironment
} from '../environmentEncoders'

describe('encodeEarthdataEnvironment', () => {
  describe('when no value is provided', () => {
    test('returns an empty string', () => {
      const response = encodeEarthdataEnvironment()

      expect(response).toEqual('')
    })
  })

  describe('when the provided value matches deployedEnvironment', () => {
    test('returns an empty string', () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

      const response = encodeEarthdataEnvironment('prod')

      expect(response).toEqual('')
    })
  })

  describe('when the provided value does not match deployedEnvironment', () => {
    test('returns the provided environment', () => {
      const response = encodeEarthdataEnvironment('uat')

      expect(response).toEqual('uat')
    })
  })
})

describe('decodeEarthdataEnvironment', () => {
  describe('when no value is provided', () => {
    test('returns the deployedEnvironment', () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

      const response = decodeEarthdataEnvironment()

      expect(response).toEqual('prod')
    })
  })

  describe('when a value is provided', () => {
    test('returns the provided environment', () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

      const response = decodeEarthdataEnvironment('uat')

      expect(response).toEqual('uat')
    })
  })
})
