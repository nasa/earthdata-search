import projectionCodes from '../../../constants/projectionCodes'

import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import mapLayers from '../../../constants/mapLayers'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'default'
  }))
})

describe('decodes base correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: {
          worldImagery: false,
          trueColor: true,
          landWaterMap: false
        },
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?base=trueColor')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: {
          worldImagery: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?base=somethingElse')).toEqual(expectedResult)
  })
})

describe('decodes latitude correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: 1,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?lat=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?lat=test')).toEqual(expectedResult)
  })
})

describe('decodes longitude correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: 1,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?long=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?long=test')).toEqual(expectedResult)
  })
})

describe('decodes overlays correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: {
          coastlines: true,
          bordersRoads: true,
          placeLabels: false
        },
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?overlays=bordersRoads%2Ccoastlines')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: {
          coastlines: false,
          bordersRoads: false,
          placeLabels: false
        },
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?overlays=test')).toEqual(expectedResult)
  })
})

describe('decodes projection correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: 'epsg3031',
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?projection=EPSG%3A3031')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?projection=test')).toEqual(expectedResult)
  })
})

describe('decodes rotation correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: 1,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?rotation=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?rotation=test')).toEqual(expectedResult)
  })
})

describe('decodes zoom correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: 1
      }
    }
    expect(decodeUrlParams('?zoom=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: undefined,
        latitude: undefined,
        longitude: undefined,
        overlays: undefined,
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?zoom=test')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  describe('map', () => {
    const defaultProps = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      map: {
        base: {
          worldImagery: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: 0,
        longitude: 0,
        overlays: {
          bordersRoads: true,
          coastlines: false,
          placeLabels: true
        },
        projection: projectionCodes.geographic,
        rotation: 0,
        zoom: 3
      }
    }

    test('does not encode the default map state', () => {
      expect(encodeUrlQuery(defaultProps)).toEqual('/path/here')
    })

    test('encodes map correctly', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            worldImagery: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 10,
          longitude: 15,
          overlays: {
            bordersRoads: true,
            coastlines: false,
            placeLabels: false
          },
          rotation: 0,
          zoom: 0
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?base=landWaterMap&lat=10&long=15&overlays=bordersRoads&zoom=0')
    })

    test('encodes map correctly when map preferences exist', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            worldImagery: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 10,
          longitude: 15,
          overlays: {
            bordersRoads: true,
            coastlines: false,
            placeLabels: false
          },
          rotation: 0,
          zoom: 0
        },
        mapPreferences: {
          baseLayer: mapLayers.worldImagery,
          latitude: 39,
          longitude: -95,
          overlayLayers: [
            mapLayers.bordersRoads,
            mapLayers.placeLabels
          ],
          projection: projectionCodes.geographic,
          rotation: 1,
          zoom: 4
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?base=landWaterMap&lat=10&long=15&overlays=bordersRoads&rotation=0&zoom=0')
    })

    test('does not encode the map when it matches the map preferences', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            worldImagery: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 39,
          longitude: -95,
          overlays: {
            bordersRoads: true,
            coastlines: false,
            placeLabels: false
          },
          rotation: 1,
          zoom: 4
        },
        mapPreferences: {
          baseLayer: mapLayers.landWaterMap,
          latitude: 39,
          longitude: -95,
          overlayLayers: [
            mapLayers.bordersRoads
          ],
          projection: projectionCodes.geographic,
          rotation: 1,
          zoom: 4
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })
  })
})
