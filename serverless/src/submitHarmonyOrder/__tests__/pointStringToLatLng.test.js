import { pointStringToLatLng } from '../pointStringToLatLng'

describe('pointStringToLatLng', () => {
  describe('when the provided string contains 2 values', () => {
    test('returns a single coordinate', () => {
      expect(pointStringToLatLng('17, 34')).toEqual({
        lat: 34,
        lng: 17
      })
    })
  })

  describe('when the provided string contains 3 values', () => {
    test('returns a single coordinate with a radius', () => {
      expect(pointStringToLatLng('17, 34, 2000')).toEqual({
        lat: 34,
        lng: 17,
        radius: 2000
      })
    })
  })

  describe('when the provided string contains more than 3 values', () => {
    test('returns an array of coordinates', () => {
      expect(pointStringToLatLng('5, 10, 15, 20')).toEqual([
        [20, 15],
        [10, 5]
      ])
    })

    test('returns an array of coordinates', () => {
      expect(pointStringToLatLng('5, 10, 15, 20, 25, 30')).toEqual([
        [30, 25],
        [20, 15],
        [10, 5]
      ])
    })
  })
})
