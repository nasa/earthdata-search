import { ccwShapefile } from '../ccwShapefile'
import {
  mockCcwShapefile,
  mockCwShapefile,
  mockCwShapefileConverted
} from './mocks'

describe('ccwShapefile', () => {
  describe('with a CW shapefile', () => {
    test('returns a CCW shapefile', () => {
      expect(ccwShapefile(mockCwShapefile)).toEqual(mockCwShapefileConverted)
    })
  })

  describe('with a CCW shapefile', () => {
    test('returns a CCW shapefile', () => {
      expect(ccwShapefile(mockCcwShapefile)).toEqual(mockCcwShapefile)
    })
  })
})
