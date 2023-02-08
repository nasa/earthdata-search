import { supportsTemporalSubsetting } from '../supportsTemporalSubsetting'

describe('supportsTemporalSubsetting', () => {
  describe('when temporal subsetting is supported', () => {
    test('returns true', () => {
      const response = supportsTemporalSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          subset: {
            temporalSubset: {
              allowMultipleValues: false
            }
          }
        }
      })

      expect(response).toBeTruthy()
    })
  })

  describe('when temporal subsetting is not supported', () => {
    test('returns false', () => {
      const response = supportsTemporalSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          supportedReformattings: {}
        }
      })

      expect(response).toBeFalsy()
    })
  })
})
