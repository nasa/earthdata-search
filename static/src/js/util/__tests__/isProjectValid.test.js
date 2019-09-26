import { isProjectValid } from '../isProjectValid'
import { selectedAccessMethod } from '../../actions/project';

describe('isProjectValid', () => {
  describe('when all collections are invalid', () => {
    test('returns false', () => {
      const collections = [
        {
          accessMethods: {}
        },
        {
          accessMethods: {}
        },
        {
          accessMethods: {}
        }
      ]
      expect(isProjectValid(collections)).toEqual(false)
    })
  })

  describe('when some collections are invalid', () => {
    test('returns false', () => {
      const collections = [
        {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        },
        {
          accessMethods: {}
        },
        {
          accessMethods: {}
        }
      ]
      expect(isProjectValid(collections)).toEqual(false)
    })
  })

  describe('when all collections are valid', () => {
    test('returns true', () => {
      const collections = [
        {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        },
        {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        },
        {
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            }
          },
          selectedAccessMethod: 'download'
        }
      ]
      expect(isProjectValid(collections)).toEqual(true)
    })
  })
})
