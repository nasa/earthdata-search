import L from 'leaflet'

import '../sphericalPolygon'

import {
  buildLayer,
  getLines,
  getPoints,
  getPolygons,
  getRectangles,
  isCartesian,
  parseSpatial
} from '../layers'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('layers util', () => {
  describe('isCartesian', () => {
    test('returns true if the coordinateSystem is CARTESIAN', () => {
      expect(isCartesian({ coordinateSystem: 'CARTESIAN' })).toBeTruthy()
    })
  })

  describe('parseSpatial', () => {
    test('parses a spatial string into an array of latlng points', () => {
      const string = '-19.9968 179.952 -20.2677 -162.2096 -9.9829 -162.4604 -9.7245 -179.4645 -19.9968 179.952'

      const expectedResult = [
        {
          lat: -19.9968,
          lng: 179.952
        },
        {
          lat: -20.2677,
          lng: -162.2096
        },
        {
          lat: -9.9829,
          lng: -162.4604
        },
        {
          lat: -9.7245,
          lng: -179.4645
        },
        {
          lat: -19.9968,
          lng: 179.952
        }
      ]

      expect(parseSpatial(string)).toEqual(expectedResult)
    })

    test('returns null if no string is passed', () => {
      expect(parseSpatial()).toEqual(null)
    })

    test('parses the first item if string is passed as an array', () => {
      const string = ['-19.9968 179.952 -20.2677 -162.2096 -9.9829 -162.4604 -9.7245 -179.4645 -19.9968 179.952']

      const expectedResult = [
        {
          lat: -19.9968,
          lng: 179.952
        },
        {
          lat: -20.2677,
          lng: -162.2096
        },
        {
          lat: -9.9829,
          lng: -162.4604
        },
        {
          lat: -9.7245,
          lng: -179.4645
        },
        {
          lat: -19.9968,
          lng: 179.952
        }
      ]

      expect(parseSpatial(string)).toEqual(expectedResult)
    })

    test('parses a spatial string into an array of latlng points when they are comma-delimited', () => {
      const string = '-19.9968,179.952,-20.2677,-162.2096,-9.9829,-162.4604,-9.7245,-179.4645,-19.9968,179.952'

      const expectedResult = [
        {
          lat: -19.9968,
          lng: 179.952
        },
        {
          lat: -20.2677,
          lng: -162.2096
        },
        {
          lat: -9.9829,
          lng: -162.4604
        },
        {
          lat: -9.7245,
          lng: -179.4645
        },
        {
          lat: -19.9968,
          lng: 179.952
        }
      ]

      expect(parseSpatial(string)).toEqual(expectedResult)
    })
  })

  describe('getPoints', () => {
    test('returns points from metadata', () => {
      const metadata = {
        points: ['-77 34']
      }

      expect(getPoints(metadata)).toEqual([{ lat: -77, lng: 34 }])
    })

    test('returns an empty array if no points exist', () => {
      expect(getPoints()).toEqual([])
    })
  })

  describe('getPolygons', () => {
    test('returns polygons from metadata', () => {
      const metadata = {
        polygons: [['-10 -162.4683 -10.013 -151.7155 -0.0009 -149.4309 0.015 -160.0162 -10 -162.4683']]
      }

      const expectedResult = [
        [
          [
            { lat: -10, lng: -162.4683 },
            { lat: -10.013, lng: -151.7155 },
            { lat: -0.0009, lng: -149.4309 },
            { lat: 0.015, lng: -160.0162 },
            { lat: -10, lng: -162.4683 }
          ]
        ]
      ]

      expect(getPolygons(metadata)).toEqual(expectedResult)
    })

    test('returns an empty array if no polygons exist', () => {
      expect(getPolygons()).toEqual([])
    })
  })

  describe('getLines', () => {
    test('returns lines from metadata', () => {
      // Don't know that this is the correct format
      const metadata = {
        lines: ['-10 -162.4683 -10.013 -151.7155 -0.0009 -149.4309']
      }

      const expectedResult = [
        [
          { lat: -10, lng: -162.4683 },
          { lat: -10.013, lng: -151.7155 },
          { lat: -0.0009, lng: -149.4309 }
        ]
      ]

      expect(getLines(metadata)).toEqual(expectedResult)
    })

    test('returns an empty array if no lines exist', () => {
      expect(getLines()).toEqual([])
    })
  })

  describe('getRectangles', () => {
    test('returns boxes from metadata', () => {
      const metadata = {
        boxes: ['-81.15 141.81 81.15 180']
      }

      const expectedResult = [
        [
          { lat: -81.15, lng: 141.81 },
          { lat: -81.15, lng: 180 },
          { lat: 81.15, lng: 180 },
          { lat: 81.15, lng: 141.81 },
          { lat: -81.15, lng: 141.81 }
        ]
      ]

      expect(getRectangles(metadata)).toEqual(expectedResult)
    })

    test('returns an empty array if no boxes exist', () => {
      expect(getRectangles()).toEqual([])
    })
  })

  describe('buildLayer', () => {
    beforeEach(() => {
      jest.spyOn(L, 'FeatureGroup').mockImplementation(() => ({
        addLayer: (layer) => ({ ...layer })
      }))
    })

    test('returns a point layer when point spatial is provided', () => {
      const circleMarkerMock = jest.spyOn(L, 'circleMarker').mockImplementation((point) => ({ ...point }))

      const metadata = {
        points: ['-77 34']
      }

      buildLayer({}, metadata)

      expect(circleMarkerMock).toBeCalledTimes(1)
      expect(circleMarkerMock).toBeCalledWith({ lat: -77, lng: 34 }, {})
    })

    describe('with polygon spatial', () => {
      test('returns a polygon layer when polygon spatial is cartesian', () => {
        const polygon = jest.spyOn(L, 'polygon').mockImplementation((point) => ({ ...point }))

        const metadata = {
          coordinateSystem: 'CARTESIAN',
          polygons: [['-10 -162.4683 -10.013 -151.7155 -0.0009 -149.4309 0.015 -160.0162 -10 -162.4683']]
        }

        buildLayer({}, metadata)

        expect(polygon).toBeCalledTimes(1)
        expect(polygon).toBeCalledWith([
          [
            { lat: -10, lng: -162.4683 },
            { lat: -10.013, lng: -151.7155 },
            { lat: -0.0009, lng: -149.4309 },
            { lat: 0.015, lng: -160.0162 },
            { lat: -10, lng: -162.4683 }]
        ])
      })

      test('returns a sphericalPolygon layer when polygon spatial is not cartesian', () => {
        const sphericalPolygonMock = jest.spyOn(L, 'sphericalPolygon').mockImplementation((point) => ({ ...point }))

        const metadata = {
          polygons: [['-10 -162.4683 -10.013 -151.7155 -0.0009 -149.4309 0.015 -160.0162 -10 -162.4683']]
        }

        buildLayer({}, metadata)

        expect(sphericalPolygonMock).toBeCalledTimes(1)
        expect(sphericalPolygonMock).toBeCalledWith([
          [
            { lat: -10, lng: -162.4683 },
            { lat: -10.013, lng: -151.7155 },
            { lat: -0.0009, lng: -149.4309 },
            { lat: 0.015, lng: -160.0162 },
            { lat: -10, lng: -162.4683 }]
        ], {})
      })
    })

    test('returns a line layer when line spatial is provided', () => {
      const polylineMock = jest.spyOn(L, 'polyline').mockImplementation((point) => ({ ...point }))

      const metadata = {
        lines: ['-10 -162.4683 -10.013 -151.7155 -0.0009 -149.4309']
      }

      buildLayer({}, metadata)

      expect(polylineMock).toBeCalledTimes(1)
      expect(polylineMock).toBeCalledWith([
        { lat: -10, lng: -162.4683 },
        { lat: -10.013, lng: -151.7155 },
        { lat: -0.0009, lng: -149.4309 }
      ], {})
    })

    test('returns a polygon layer when cartesian boxes spatial is provided', () => {
      const polygonMock = jest.spyOn(L, 'polygon').mockImplementation((point) => ({ ...point }))

      const metadata = {
        coordinateSystem: 'CARTESIAN',
        boxes: ['-81.15 141.81 81.15 180']
      }

      buildLayer({}, metadata)

      expect(polygonMock).toBeCalledTimes(1)
      expect(polygonMock).toBeCalledWith([
        { lat: -81.15, lng: 141.81 },
        { lat: -81.15, lng: 180 },
        { lat: 81.15, lng: 180 },
        { lat: 81.15, lng: 141.81 },
        { lat: -81.15, lng: 141.81 }
      ], {})
    })

    test('returns a sphericalPolygon layer when geodetic boxes spatial is provided', () => {
      const sphericalPolygonMock = jest.spyOn(L, 'sphericalPolygon').mockImplementation((point) => ({ ...point }))

      const metadata = {
        coordinateSystem: 'GEODETIC',
        boxes: ['-81.15 141.81 81.15 180']
      }

      buildLayer({}, metadata)

      expect(sphericalPolygonMock).toBeCalledTimes(1)
      expect(sphericalPolygonMock).toBeCalledWith([
        { lat: -81.15, lng: 141.81 },
        { lat: -81.15, lng: 180 },
        { lat: 81.15, lng: 180 },
        { lat: 81.15, lng: 141.81 },
        { lat: -81.15, lng: 141.81 }
      ], {})
    })
  })
})
