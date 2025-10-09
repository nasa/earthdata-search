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
      mapView: {
        base: {
          worldImagery: false,
          trueColor: true,
          landWaterMap: false
        }
      }
    }
    expect(decodeUrlParams('?base=trueColor')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        base: {
          worldImagery: true,
          trueColor: false,
          landWaterMap: false
        }
      }
    }
    expect(decodeUrlParams('?base=somethingElse')).toEqual(expectedResult)
  })
})

describe('decodes latitude correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        latitude: 1
      }
    }
    expect(decodeUrlParams('?lat=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {}
    }
    expect(decodeUrlParams('?lat=test')).toEqual(expectedResult)
  })
})

describe('decodes longitude correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        longitude: 1
      }
    }
    expect(decodeUrlParams('?long=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {}
    }
    expect(decodeUrlParams('?long=test')).toEqual(expectedResult)
  })
})

describe('decodes overlays correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        overlays: {
          coastlines: true,
          bordersRoads: true,
          placeLabels: false
        }
      }
    }
    expect(decodeUrlParams('?overlays=bordersRoads%2Ccoastlines')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        overlays: {
          coastlines: false,
          bordersRoads: false,
          placeLabels: false
        }
      }
    }
    expect(decodeUrlParams('?overlays=test')).toEqual(expectedResult)
  })
})

describe('decodes projection correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        projection: 'epsg3031'
      }
    }
    expect(decodeUrlParams('?projection=EPSG%3A3031')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {}
    }
    expect(decodeUrlParams('?projection=test')).toEqual(expectedResult)
  })
})

describe('decodes rotation correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        rotation: 1
      }
    }
    expect(decodeUrlParams('?rotation=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {}
    }
    expect(decodeUrlParams('?rotation=test')).toEqual(expectedResult)
  })
})

describe('decodes zoom correctly', () => {
  test('when the result is valid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {
        zoom: 1
      }
    }
    expect(decodeUrlParams('?zoom=1')).toEqual(expectedResult)
  })

  test('when the result is invalid', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      mapView: {}
    }
    expect(decodeUrlParams('?zoom=test')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  describe('map', () => {
    const defaultProps = {
      collectionsQuery: {
        hasGranulesOrCwic: true
      },
      pathname: '/path/here',
      mapView: {
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
        mapView: {
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
        mapView: {
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
        mapView: {
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
