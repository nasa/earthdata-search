import { decodeInteger, encodeInteger } from '../integerEncoders'

describe('decodeInteger', () => {
  describe('when a string is provided', () => {
    test('returns the provided value as an integer', () => {
      const response = decodeInteger('25')

      expect(response).toEqual(25)
    })
  })

  describe('when an integer is provided', () => {
    test('returns the provided value as an integer', () => {
      const response = decodeInteger(25)

      expect(response).toEqual(25)
    })
  })
})

describe('encodeInteger', () => {
  test('returns the provided value', () => {
    const response = encodeInteger(25)

    expect(response).toEqual(25)
  })
})
