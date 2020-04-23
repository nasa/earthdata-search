import { convertRemsToPixels } from '../convertRemsToPixels'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('convertRemsToPixels', () => {
  describe('when the font size is the default', () => {
    test('returns the correct values', () => {
      window.getComputedStyle = jest.fn()
        .mockImplementationOnce(() => ({
          fontSize: 16
        }))

      const result = convertRemsToPixels(1)

      expect(result).toEqual(16)
    })
  })

  describe('when the font size is not the default', () => {
    test('returns the correct values', () => {
      window.getComputedStyle = jest.fn()
        .mockImplementationOnce(() => ({
          fontSize: 16.4
        }))

      const result = convertRemsToPixels(2)

      expect(result).toEqual(32.8)
    })
  })
})
