import { isProjectValid } from '../isProjectValid'

describe('isProjectValid', () => {
  describe('when all collections are invalid', () => {
    test('returns false', () => {
      const collections = [
        {
          isValid: false
        },
        {
          isValid: false
        },
        {
          isValid: false
        }
      ]
      expect(isProjectValid(collections)).toEqual(false)
    })
  })

  describe('when some collections are invalid', () => {
    test('returns false', () => {
      const collections = [
        {
          isValid: true
        },
        {
          isValid: false
        },
        {
          isValid: false
        }
      ]
      expect(isProjectValid(collections)).toEqual(false)
    })
  })

  describe('when all collections are valid', () => {
    test('returns true', () => {
      const collections = [
        {
          isValid: true
        },
        {
          isValid: true
        },
        {
          isValid: true
        }
      ]
      expect(isProjectValid(collections)).toEqual(true)
    })
  })
})
