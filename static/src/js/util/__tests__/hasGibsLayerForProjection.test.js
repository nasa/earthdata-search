import projections from '../map/projections'
import hasGibsLayerForProjection from '../hasGibsLayerForProjection'

describe('hasGibsLayerForProjection test', () => {
  test('returns false with no values', () => {
    const gibsLayer = {
      arctic: null,
      geographic: null,
      antarctic: null
    }

    expect(hasGibsLayerForProjection(gibsLayer, projections.arctic)).toBe(false)
  })

  test('returns true with valid artic value', () => {
    const gibsLayer = {
      arctic: true,
      geographic: null,
      antarctic: null
    }

    expect(hasGibsLayerForProjection(gibsLayer, 'epsg3413')).toBeTruthy()
  })
})
describe('hasGibsLayerForProjection test for geographic/antarctic values', () => {
  test('returns true with valid geographic value', () => {
    const gibsLayer = {
      arctic: null,
      geographic: true,
      antarctic: null
    }

    expect(hasGibsLayerForProjection(gibsLayer, 'epsg4326')).toBeTruthy()
  })

  test('returns true with invalid antarctic value', () => {
    const gibsLayer = {
      arctic: null,
      geographic: null,
      antarctic: true
    }

    expect(hasGibsLayerForProjection(gibsLayer, 'epsg3031')).toBeTruthy()
  })

  test('returns false with invalid antarctic value', () => {
    const gibsLayer = {
      arctic: null,
      geographic: null,
      antarctic: true
    }

    expect(hasGibsLayerForProjection(gibsLayer, 'epsg3030')).toBeFalsy()
  })
})
