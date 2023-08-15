import createSpatialDisplay from '../createSpatialDisplay'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createSpatialDisplay', () => {
  const spatial = {
    boundingBox: undefined,
    circle: undefined,
    line: undefined,
    point: undefined,
    polygon: undefined
  }
  describe('boundingBox', () => {
    test('returns the correct values', () => {
      const newSpatial = {
        ...spatial,
        boundingBox: ['105.57422,-9.56677,107.40234,-8.23114']
      }

      const result = createSpatialDisplay(newSpatial)

      expect(result).toEqual('SW: (-9.56677, 105.57422) NE: (-8.23114, 107.40234)')
    })
  })
  describe('circle', () => {
    test('returns the correct values', () => {
      const newSpatial = {
        ...spatial,
        circle: ['105.57422,-9.56677,14412']
      }

      const result = createSpatialDisplay(newSpatial)

      expect(result).toEqual('Center: (-9.56677, 105.57422) Radius (m): 14412)')
    })
  })
  describe('line', () => {
    test('returns the correct values', () => {
      const newSpatial = {
        ...spatial,
        line: ['105.57422,-9.56677,106.22133,-7.12233']
      }

      const result = createSpatialDisplay(newSpatial)

      expect(result).toEqual('Start: (-9.56677, 105.57422) End: (-7.12233, 106.22133)')
    })
  })
  describe('point', () => {
    test('returns the correct values', () => {
      const newSpatial = {
        ...spatial,
        point: ['105.57422,-9.56677']
      }

      const result = createSpatialDisplay(newSpatial)

      expect(result).toEqual('Point: (-9.56677, 105.57422)')
    })
  })
  describe('polygon', () => {
    test('returns the correct values', () => {
      const newSpatial = {
        ...spatial,
        polygon: ['105.1875,-8.94785,105.17432,-8.80725,104.8667,-8.77649,104.82715,-8.95223,104.76563,-9.05328,104.73047,-9.29493,104.81396,-9.56732,104.82715,-9.83093,104.92383,-9.97592,105.16992,-9.93198,105.11719,-9.70352,105.31055,-9.57171,105.58301,-9.48824,105.6709,-9.22463,105.55664,-9.00497,105.44678,-8.86437,105.1875,-8.94785']
      }

      const result = createSpatialDisplay(newSpatial)

      expect(result).toEqual('16 Points')
    })
  })
  describe('empty', () => {
    test('returns the correct values', () => {
      const result = createSpatialDisplay(spatial)

      expect(result).toEqual('')
    })
  })
})
