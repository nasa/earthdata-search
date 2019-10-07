jest.mock('browser-detect', () => jest.fn())

import MockedBrowserDetect from 'browser-detect'
import { isBrowserCompatible } from '../isBrowserCompatible'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('isBrowserCompatible', () => {
  describe('for incompatible Internet Explorer', () => {
    test('returns false ', () => {
      MockedBrowserDetect.mockImplementation(() => ({
        name: 'ie',
        versionNumber: 10
      }))
      const result = isBrowserCompatible()

      expect(result).toEqual(false)
      expect(MockedBrowserDetect).toHaveBeenCalledTimes(1)
    })
  })

  describe('for compatible Internet Explorer', () => {
    test('returns false for compatible Internet Explorer', () => {
      MockedBrowserDetect.mockImplementation(() => ({
        name: 'ie',
        versionNumber: 10
      }))
      const result = isBrowserCompatible()

      expect(result).toEqual(false)
      expect(MockedBrowserDetect).toHaveBeenCalledTimes(1)
    })
  })

  describe('for compatible browsers', () => {
    test('returns true for compatible browsers', () => {
      MockedBrowserDetect.mockImplementation(() => ({
        name: 'chrome',
        versionNumber: 50
      }))
      const result = isBrowserCompatible()

      expect(result).toEqual(true)
      expect(MockedBrowserDetect).toHaveBeenCalledTimes(1)
    })
  })
})
