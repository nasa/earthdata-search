import { supportsBoundingBoxSubsetting } from '../supportsBoundingBoxSubsetting'

describe('supportsBoundingBoxSubsetting', () => {
  describe('when variable subsetting is supported', () => {
    test('returns true', () => {
      const response = supportsBoundingBoxSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          subset: {
            spatialSubset: {
              boundingBox: {
                allowMultipleValues: true
              }
            }
          }
        }
      })

      expect(response).toBeTruthy()
    })
  })

  describe('when variable subsetting is not supported', () => {
    test('returns false', () => {
      const response = supportsBoundingBoxSubsetting({
        conceptId: 'S100000-EDSC',
        serviceOptions: {
          supportedReformattings: {}
        }
      })

      expect(response).toBeFalsy()
    })
  })
})
