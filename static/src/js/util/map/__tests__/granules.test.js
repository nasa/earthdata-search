import {
  isClockwise
} from '../granules'

import {
  isCartesian,
  getPoints,
  getPolygons,
  getLines,
  getRectangles
} from '../layers'

describe('granules#isClockwise', () => {
  test('doin stuff here', () => {
    const clockwiseInput = [
      { x: -262, y: 1100 },
      { x: 250, y: 1100 },
      { x: 250, y: 588 },
      { x: -262, y: 588 }
    ]

    const counterClockwiseInput = [
      { x: -262, y: 588 },
      { x: 250, y: 588 },
      { x: 250, y: 1100 },
      { x: -262, y: 1100 }
    ]

    expect(isClockwise(clockwiseInput)).toEqual(true)
    expect(isClockwise(counterClockwiseInput)).toEqual(false)
  })
})

describe('granules#isCartesian', () => {
  test('returns true if coordinate system is cartesian', () => {
    expect(isCartesian({ coordinateSystem: 'CARTESIAN' })).toBeTruthy()
  })

  test('returns false if coordinate system is not cartesian', () => {
    expect(isCartesian({ coordinateSystem: 'GEODETIC' })).toBeFalsy()
  })
})

describe('granules#getPoints', () => {
  test('returns points lat/lngs', () => {
    const expectedResult = [{ lat: 10, lng: 15 }]
    expect(getPoints({ points: ['10 15'] })).toEqual(expectedResult)
  })

  test('returns an empty array if no points exist', () => {
    expect(getPoints({})).toEqual([])
  })
})

describe('granules#getPolygons', () => {
  test('returns polygon lat/lngs', () => {
    const expectedResult = [[[
      { lat: -55, lng: 174 },
      { lat: -61, lng: 133 },
      { lat: -79, lng: 125 },
      { lat: -68, lng: -156 },
      { lat: -55, lng: 174 }
    ]]]
    expect(getPolygons({ polygons: [['-55 174 -61 133 -79 125 -68 -156 -55 174']] })).toEqual(expectedResult)
  })

  test('returns an empty array if no polygons exist', () => {
    expect(getPolygons({})).toEqual([])
  })
})

describe('granules#getLines', () => {
  test('returns lines lat/lngs', () => {
    const expectedResult = [[
      { lat: 0, lng: 0 },
      { lat: 10, lng: 15 }
    ]]
    expect(getLines({ lines: ['0 0 10 15'] })).toEqual(expectedResult)
  })

  test('returns an empty array if no lines exist', () => {
    expect(getLines({})).toEqual([])
  })
})

describe('granules#getRectangles', () => {
  test('returns rectangle lat/lngs', () => {
    const expectedResult = [
      [
        { lat: 1, lng: 2 },
        { lat: 1, lng: 4 },
        { lat: 3, lng: 4 },
        { lat: 3, lng: 2 },
        { lat: 1, lng: 2 }
      ]
    ]
    expect(getRectangles({ boxes: ['1 2 3 4'] })).toEqual(expectedResult)
  })

  test('returns an empty array if no rectangles exist', () => {
    expect(getRectangles({})).toEqual([])
  })
})
