import { supportsVariableSubsetting } from '../supportsVariableSubsetting'

describe('supportsVariableSubsetting', () => {
  describe('when variable subsetting is supported', () => {
    test('returns true', () => {
      const response = supportsVariableSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          subset: {
            variableSubset: {
              allowMultipleValues: true
            }
          }
        }
      })

      expect(response).toBeTruthy()
    })
  })

  describe('when variable subsetting is not supported', () => {
    test('returns false', () => {
      const response = supportsVariableSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: null
      })

      expect(response).toBeFalsy()
    })
  })
})
