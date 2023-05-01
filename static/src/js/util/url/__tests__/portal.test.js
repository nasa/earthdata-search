import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import { decodePortal, encodePortal } from '../portalEncoders'

jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
  defaultPortal: 'edsc'
}))

describe('encodePortal', () => {
  describe('when no value is provided', () => {
    test('returns an empty string', () => {
      const response = encodePortal()

      expect(response).toEqual('')
    })
  })

  describe('when the provided value matches defaultPortal', () => {
    test('returns an empty string', () => {
      const response = encodePortal('edsc')

      expect(response).toEqual('')
    })
  })

  describe('when the provided value does not match defaultPortal', () => {
    test('returns the portal', () => {
      const response = encodePortal('example')

      expect(response).toEqual({ portal: 'example' })
    })
  })
})

describe('decodeEarthdataEnvironment', () => {
  describe('when no param is provided', () => {
    test('returns the portal', () => {
      const response = decodePortal({})

      expect(response).toEqual('edsc')
    })
  })

  describe('when no portal value is provided', () => {
    test('returns the portal', () => {
      const response = decodePortal({ mock: {} })

      expect(response).toEqual('edsc')
    })
  })

  describe('when a value is provided', () => {
    test('returns the provided environment', () => {
      const response = decodePortal({ portal: 'example' })

      expect(response).toEqual('example')
    })
  })
})
