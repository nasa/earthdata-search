import { panBoundsToCenter } from '../panBoundsToCenter'

const mockMapFlyTo = jest.fn()

const mockMapFitBounds = jest.fn(() => ({
  flyTo: mockMapFlyTo
}))

const mockMap = {
  fitBounds: mockMapFitBounds
}

const mockInvalidBounds = {}

const mockBoundsIsValid = jest.fn(() => true)

const mockBoundsGetCenter = jest.fn(() => ({ lat: 77, lng: -86 }))

const mockValidBounds = {
  isValid: mockBoundsIsValid,
  getCenter: mockBoundsGetCenter
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('#panBoundsToCenter', () => {
  describe('when passed invalid bounds', () => {
    test('should do nothing', () => {
      panBoundsToCenter(mockMap, mockInvalidBounds)
      expect(mockMapFitBounds).not.toHaveBeenCalled()
    })
  })

  describe('when passed valid bounds', () => {
    test('should fit the bounds', () => {
      panBoundsToCenter(mockMap, mockValidBounds)
      expect(mockMapFitBounds).toHaveBeenCalled()
      expect(mockMapFitBounds).toHaveBeenCalledWith(mockValidBounds, { padding: [200, 200] })
    })

    test('should pan to bounds center', () => {
      panBoundsToCenter(mockMap, mockValidBounds)
      expect(mockBoundsGetCenter).toHaveBeenCalled()
      expect(mockBoundsGetCenter).toHaveBeenCalledWith()
      expect(mockMapFlyTo).toHaveBeenCalled()
      expect(mockMapFlyTo).toHaveBeenCalledWith({ lat: 77, lng: -86 })
    })
  })
})
