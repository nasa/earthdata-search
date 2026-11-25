import splitShapefileOnAntimeridian from '../splitShapefileOnAntimeridian'

import type { ShapefileFile } from '../../../types/sharedTypes'

const createFile = (geometry: unknown): ShapefileFile => ({
  type: 'FeatureCollection',
  name: 'test.geojson',
  features: [{
    type: 'Feature',
    properties: { edscId: '0' },
    geometry
  }]
} as ShapefileFile)

describe('splitShapefileOnAntimeridian', () => {
  describe('when the feature does not cross the antimeridian', () => {
    test('does not modify the feature', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [[[10, 0], [20, 0], [20, 10], [10, 10], [10, 0]]]
      })

      expect(splitShapefileOnAntimeridian(file)).toEqual(file)
    })
  })

  describe('when the feature is not a polygon', () => {
    test('does not modify the feature', () => {
      const file = createFile({
        type: 'LineString',
        coordinates: [[170, 0], [-170, 0]]
      })

      expect(splitShapefileOnAntimeridian(file)).toEqual(file)
    })
  })

  describe('when the polygon crosses the antimeridian', () => {
    test('splits the polygon into a multipolygon along the great circle crossing', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [[[170, 0], [-170, 0], [-170, 10], [170, 10], [170, 0]]]
      })

      expect(splitShapefileOnAntimeridian(file)).toEqual({
        type: 'FeatureCollection',
        name: 'test.geojson',
        features: [{
          type: 'Feature',
          properties: { edscId: '0' },
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [180, 10.15108171104812],
                  [170, 10],
                  [170, 0],
                  [170, 0],
                  [180, 0],
                  [180, 10.15108171104812]
                ]
              ],
              [
                [
                  [-180, 0],
                  [-170, 0],
                  [-170, 10],
                  [-180, 10.15108171104812],
                  [-180, 0]
                ]
              ]
            ]
          }
        }]
      })
    })
  })

  describe('when the polygon is defined with longitudes greater than 180', () => {
    test('normalizes the longitudes and splits the polygon', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [[[170, 0], [190, 0], [190, 10], [170, 10], [170, 0]]]
      })

      expect(splitShapefileOnAntimeridian(file).features[0].geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180, 10.15108171104812],
              [170, 10],
              [170, 0],
              [170, 0],
              [180, 0],
              [180, 10.15108171104812]
            ]
          ],
          [
            [
              [-180, 0],
              [-170, 0],
              [-170, 10],
              [-180, 10.15108171104812],
              [-180, 0]
            ]
          ]
        ]
      })
    })
  })

  describe('when the polygon is at a high latitude', () => {
    test('splits the polygon along the great circle crossing on both edges', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [[[170, 70], [-170, 70], [-170, 80], [170, 80], [170, 70]]]
      })

      expect(splitShapefileOnAntimeridian(file).features[0].geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180, 80.1489238834161],
              [170, 80],
              [170, 70],
              [170, 70],
              [180, 70.28025358554098],
              [180, 80.1489238834161]
            ]
          ],
          [
            [
              [-180, 70.28025358554098],
              [-170, 70],
              [-170, 80],
              [-180, 80.1489238834161],
              [-180, 70.28025358554098]
            ]
          ]
        ]
      })
    })
  })

  describe('when the polygon has a hole that does not cross the antimeridian', () => {
    test('adds the hole to the polygon that contains it', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [
          [[160, 0], [-160, 0], [-160, 20], [160, 20], [160, 0]],
          [[165, 5], [165, 15], [170, 15], [170, 5], [165, 5]]
        ]
      })

      expect(splitShapefileOnAntimeridian(file).features[0].geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180, 21.172832185162957],
              [160, 20],
              [160, 0],
              [160, 0],
              [180, 0],
              [180, 21.172832185162957]
            ],
            [
              [165, 5],
              [165, 15],
              [170, 15],
              [170, 5],
              [165, 5]
            ]
          ],
          [
            [
              [-180, 0],
              [-160, 0],
              [-160, 20],
              [-180, 21.172832185162957],
              [-180, 0]
            ]
          ]
        ]
      })
    })
  })

  describe('when the polygon has a hole that also crosses the antimeridian', () => {
    test('splits the hole and adds each piece to the polygon that contains it', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [
          [[160, 0], [-160, 0], [-160, 20], [160, 20], [160, 0]],
          [[170, 5], [-170, 5], [-170, 15], [170, 15], [170, 5]]
        ]
      })

      expect(splitShapefileOnAntimeridian(file).features[0].geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180, 21.172832185162957],
              [160, 20],
              [160, 0],
              [160, 0],
              [180, 0],
              [180, 21.172832185162957]
            ],
            [
              [180, 15.220740734412017],
              [180, 5.076733016569712],
              [170, 5],
              [170, 5],
              [170, 15],
              [180, 15.220740734412017]
            ]
          ],
          [
            [
              [-180, 0],
              [-160, 0],
              [-160, 20],
              [-180, 21.172832185162957],
              [-180, 0]
            ],
            [
              [-180, 5.076733016569712],
              [-180, 15.220740734412017],
              [-170, 15],
              [-170, 5],
              [-180, 5.076733016569712]
            ]
          ]
        ]
      })
    })
  })

  describe('when the polygon encircles the north pole', () => {
    test('returns a single polygon that runs along the pole', () => {
      const file = createFile({
        type: 'Polygon',
        coordinates: [[[0, 80], [90, 80], [180, 80], [-90, 80], [0, 80]]]
      })

      expect(splitShapefileOnAntimeridian(file).features[0].geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-180, 80],
              [-90, 80],
              [0, 80],
              [0, 80],
              [90, 80],
              [180, 80],
              [180, 90],
              [90, 90],
              [0, 90],
              [-90, 90],
              [-180, 90],
              [-180, 80]
            ]
          ]
        ]
      })
    })
  })

  describe('when the feature is a multipolygon', () => {
    test('splits only the polygons that cross the antimeridian', () => {
      const notCrossing = [[[10, 0], [20, 0], [20, 10], [10, 10], [10, 0]]]
      const file = createFile({
        type: 'MultiPolygon',
        coordinates: [
          notCrossing,
          [[[170, 0], [-170, 0], [-170, 10], [170, 10], [170, 0]]]
        ]
      })

      expect(splitShapefileOnAntimeridian(file).features[0].geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          notCrossing,
          [
            [
              [180, 10.15108171104812],
              [170, 10],
              [170, 0],
              [170, 0],
              [180, 0],
              [180, 10.15108171104812]
            ]
          ],
          [
            [
              [-180, 0],
              [-170, 0],
              [-170, 10],
              [-180, 10.15108171104812],
              [-180, 0]
            ]
          ]
        ]
      })
    })
  })
})
