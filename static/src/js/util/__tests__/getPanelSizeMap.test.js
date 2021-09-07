import { getPanelSizeMap } from '../getPanelSizeMap'

describe('getPanelSizeMap', () => {
  describe('when width is less than 500', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(499)

      expect(result).toEqual({
        xs: true,
        sm: false,
        600: false,
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
        600: false,
        md: false,
        lg: false,
        xl: false
      })
    })
  })

  describe('when width is 600', () => {
    test('returns the correct values', () => {
      const result = getPanelSizeMap(600)

      expect(result).toEqual({
        xs: true,
        sm: true,
        600: true,
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
        600: true,
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
        600: true,
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
        600: true,
        md: true,
        lg: true,
        xl: true
      })
    })
  })
})
