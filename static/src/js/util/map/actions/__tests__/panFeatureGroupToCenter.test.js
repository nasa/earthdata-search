import { panFeatureGroupToCenter } from '../panFeatureGroupToCenter'

jest.mock('../panBoundsToCenter', () => ({
  panBoundsToCenter: jest.fn()
}))

import { panBoundsToCenter } from '../panBoundsToCenter'

const mockMap = {}

const mockInvalidFeatureGroup = {}

const mockGetBounds = jest.fn(() => ([
  { lat: 77, lng: -86 },
  { lat: 79, lng: -89 }
]))

const mockValidFeatureGroup = {
  getBounds: mockGetBounds
}

describe('#panFeatureGroupToCenter', () => {
  describe('when passed invalid bounds', () => {
    test('should do nothing', () => {
      panFeatureGroupToCenter(mockMap, mockInvalidFeatureGroup)
      expect(panBoundsToCenter).not.toHaveBeenCalled()
    })
  })

  describe('when passed valid bounds', () => {
    test('should get the bounds and call panBoundsToCenter', () => {
      panFeatureGroupToCenter(mockMap, mockValidFeatureGroup)
      expect(panBoundsToCenter).toHaveBeenCalled()
    })
  })
})
