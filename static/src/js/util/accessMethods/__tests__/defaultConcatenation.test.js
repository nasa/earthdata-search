import { defaultConcatenation } from '../defaultConcatenation'

describe('defaultConcatenation', () => {
  describe('when concatenation is checked by default', () => {
    test('returns true', () => {
      const response = defaultConcatenation({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          aggregation: {
            concatenate: {
              concatenateDefault: true
            }
          }
        }
      })

      expect(response).toBeTruthy()
    })
  })

  describe('when concatenation is not in aggregation', () => {
    test('returns false', () => {
      const response = defaultConcatenation({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          aggregation: {}
        }
      })

      expect(response).toBeFalsy()
    })
  })

  describe('when concatenation is not supported', () => {
    test('returns false', () => {
      const response = defaultConcatenation({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          aggregation: {
            concatenate: {
              concatenateDefault: false
            }
          }
        }
      })

      expect(response).toBeFalsy()
    })
  })
})
