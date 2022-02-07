import L from 'leaflet'
import { calculateArea, getShape, splitListOfPoints } from '../geo'

describe('geo#calculateArea', () => {
  const lls = (latlngs) => Array.from(latlngs).map((ll) => L.latLng(ll))

  test('returns 0 for strings of fewer than 3 lat lngs', () => {
    expect(calculateArea(lls([]))).toEqual(0)
    expect(calculateArea(lls([[0, 0]]))).toEqual(0)
    expect(calculateArea(lls([[0, 0], [10, 0]]))).toEqual(0)
  })

  test('determines correct polygon interior area for polygons containing no poles', () => {
    expect(calculateArea(
      lls([[0, 0], [0, 10], [10, 0]])
    )).toBeCloseTo(0.015, 2)
  })

  test('determines correct polygon interior area for polygons crossing the antimeridian', () => {
    expect(calculateArea(
      lls([[0, 175], [0, -175], [10, 175]])
    )).toBeCloseTo(0.015, 2)
  })

  test('determines correct polygon interior area for polygons containing the north pole', () => {
    expect(calculateArea(
      lls([[85, 0], [85, 120], [85, -120]])
    )).toBeCloseTo(0.015, 2)

    expect(calculateArea(
      lls([[-85, 120], [-85, -120], [-85, 0]])
    )).toBeCloseTo(12.55, 2)
  })

  test('determines correct polygon interior area for polygons containing the south pole', () => {
    expect(calculateArea(
      lls([[-85, 0], [-85, -120], [-85, 120]])
    )).toBeCloseTo(0.015, 2)

    expect(calculateArea(
      lls([[85, -120], [85, 120], [85, 0]])
    )).toBeCloseTo(12.55, 2)
  })

  test('determines correct polygon interior area for polygons containing the both poles', () => {
    expect(calculateArea(
      lls([[0, 0], [10, 0], [0, 10]])
    )).toBeCloseTo(12.55, 2)
  })

  test('determines correct polygon interior area for polygons touching the north pole', () => {
    expect(calculateArea(
      lls([[85, 0], [85, 120], [90, 0]])
    )).toBeCloseTo(0.004, 2)
  })

  test('determines correct polygon interior area for polygons touching the south pole', () => {
    expect(calculateArea(
      lls([[-85, 0], [-85, -120], [-90, 0]])
    )).toBeCloseTo(0.004, 2)
  })

  test('determines correct polygon interior area for polygons touching the both poles', () => {
    expect(calculateArea(
      lls([[0, 5], [90, 0], [0, -5], [-90, 0]])
    )).toBeCloseTo(0.30, 2)
  })
})

describe('geo#getShape', () => {
  test('getShape returns a shape', () => {
    const shape = getShape([
      '10,0',
      '20,10',
      '5,15',
      '10,0'
    ])

    expect(shape).toEqual([{
      lat: 0,
      lng: 10
    }, {
      lat: 10,
      lng: 20
    }, {
      lat: 15,
      lng: 5
    }, {
      lat: 0,
      lng: 10
    }])
  })
})

describe('geo#splitListOfPoints', () => {
  test('splitListOfPoints splits a string of points into array of lat/lng points', () => {
    const points = splitListOfPoints('10,0,20,10,5,15,10,0')

    expect(points).toEqual([
      '10,0',
      '20,10',
      '5,15',
      '10,0'
    ])
  })
})
