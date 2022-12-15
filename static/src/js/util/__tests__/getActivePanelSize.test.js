import { getActivePanelSize } from '../getActivePanelSize'
import * as getPanelSizeMapExports from '../getPanelSizeMap'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getActivePanelSize', () => {
  describe('when width is less than 500', () => {
    test('returns the correct values', () => {
      const result = getActivePanelSize(499)

      expect(result).toEqual('xs')
    })
  })

  describe('when width is 500', () => {
    test('returns the correct values', () => {
      const result = getActivePanelSize(500)

      expect(result).toEqual('sm')
    })
  })

  describe('when width is 700', () => {
    test('returns the correct values', () => {
      const result = getActivePanelSize(700)

      expect(result).toEqual('md')
    })
  })

  describe('when width is 900', () => {
    test('returns the correct values', () => {
      const result = getActivePanelSize(900)

      expect(result).toEqual('lg')
    })
  })

  describe('when width is 1100', () => {
    test('returns the correct values', () => {
      const result = getActivePanelSize(1100)

      expect(result).toEqual('xl')
    })
  })

  describe('when no values match', () => {
    test('returns null', () => {
      // eslint-disable-next-line no-import-assign
      getPanelSizeMapExports.getPanelSizeMap = jest.fn(() => ({}))
      const result = getActivePanelSize(1100)

      expect(result).toEqual(null)
    })
  })
})
