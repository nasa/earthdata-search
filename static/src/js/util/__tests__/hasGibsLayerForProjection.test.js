import projectionCodes from '../../constants/projectionCodes'
import hasGibsLayerForProjection from '../hasGibsLayerForProjection'

describe('hasGibsLayerForProjection test', () => {
  test('returns false with no values', () => {
    const gibsLayer = {
      arctic: null,
      geographic: null,
      antarctic: null
    }

    expect(hasGibsLayerForProjection(gibsLayer, projectionCodes.arctic)).toBe(false)
  })

  test('returns true with valid arctic value', () => {
    const gibsLayer = {
      arctic: true,
      geographic: null,
      antarctic: null
    }

    expect(hasGibsLayerForProjection(gibsLayer, projectionCodes.arctic)).toBeTruthy()
  })
})

describe('hasGibsLayerForProjection test for geographic/antarctic values', () => {
  test('returns true with valid geographic value', () => {
    const gibsLayer = {
      arctic: null,
      geographic: true,
      antarctic: null
    }

    expect(hasGibsLayerForProjection(gibsLayer, projectionCodes.geographic)).toBeTruthy()
  })

  test('returns true with valid antarctic value', () => {
    const gibsLayer = {
      arctic: null,
      geographic: null,
      antarctic: true
    }

    expect(hasGibsLayerForProjection(gibsLayer, projectionCodes.antarctic)).toBeTruthy()
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
