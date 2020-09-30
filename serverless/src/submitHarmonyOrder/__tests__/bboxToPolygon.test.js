import { bboxToPolygon } from '../bboxToPolygon'

describe('bboxToPolygon', () => {
  test('returns a CW polygon', () => {
    expect(bboxToPolygon([[5, 0], [15, 10]])).toEqual([[
      [15, 10],
      [5, 10],
      [5, 0],
      [15, 0],
      [15, 10]
    ]])
  })
})
