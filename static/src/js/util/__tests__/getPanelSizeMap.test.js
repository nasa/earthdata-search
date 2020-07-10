import { getPanelSizeMap } from '../getPanelSizeMap'

describe('getPanelSizeMap', () => {
  describe('when width is less than 500', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(499)

      expect(result).toEqual({
        xs: true,
        sm: false,
        md: false,
        lg: false,
        xl: false
      })
    })
  })

  describe('when width is 500', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(500)

      expect(result).toEqual({
        xs: true,
        sm: true,
        md: false,
        lg: false,
        xl: false
      })
    })
  })

  describe('when width is 700', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(700)

      expect(result).toEqual({
        xs: true,
        sm: true,
        md: true,
        lg: false,
        xl: false
      })
    })
  })

  describe('when width is 900', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(900)

      expect(result).toEqual({
        xs: true,
        sm: true,
        md: true,
        lg: true,
        xl: false
      })
    })
  })

  describe('when width is 1100', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(1100)

      expect(result).toEqual({
        xs: true,
        sm: true,
        md: true,
        lg: true,
        xl: true
      })
    })
  })
})
