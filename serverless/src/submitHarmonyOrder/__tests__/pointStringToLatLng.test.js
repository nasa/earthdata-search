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

  describe('when the provided string contains 4 values (2 points)', () => {
    test('returns an array of coordinates represnting a bounding box', () => {
      expect(pointStringToLatLng('5, 10, 15, 20')).toEqual([
        [5, 10],
        [15, 20]
      ])
    })
  })

  describe('when the provided string contains more than 4 values (3 or more points)', () => {
    describe('when drawn clockwise', () => {
      test('returns an array of coordinates counter clockwise', () => {
        expect(pointStringToLatLng('5, 10, 5, 30, 25, 30')).toEqual([
          [25, 30],
          [5, 30],
          [5, 10]
        ])
      })
    })

    describe('when drawn counter clockwise', () => {
      test('returns an array of coordinates counter clockwise', () => {
        expect(pointStringToLatLng('5, 10, 5, 30, 25, 30')).toEqual([
          [25, 30],
          [5, 30],
          [5, 10]
        ])
      })
    })
  })
})
