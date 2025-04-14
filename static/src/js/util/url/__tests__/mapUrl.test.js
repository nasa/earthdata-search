import projections from '../../map/projections'

import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

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
          blueMarble: false,
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
          blueMarble: true,
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
          referenceFeatures: true,
          referenceLabels: false
        },
        projection: undefined,
        rotation: undefined,
        zoom: undefined
      }
    }
    expect(decodeUrlParams('?overlays=referenceFeatures%2Ccoastlines')).toEqual(expectedResult)
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
          referenceFeatures: false,
          referenceLabels: false
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
          blueMarble: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: 0,
        longitude: 0,
        overlays: {
          referenceFeatures: true,
          coastlines: false,
          referenceLabels: true
        },
        projection: projections.geographic,
        rotation: 0,
        zoom: 2
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
            blueMarble: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 10,
          longitude: 15,
          overlays: {
            referenceFeatures: true,
            coastlines: false,
            referenceLabels: false
          },
          rotation: 0,
          zoom: 0
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?base=landWaterMap&lat=10&long=15&overlays=referenceFeatures&zoom=0')
    })

    test('encodes map correctly when map preferences exist', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            blueMarble: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 10,
          longitude: 15,
          overlays: {
            referenceFeatures: true,
            coastlines: false,
            referenceLabels: false
          },
          rotation: 0,
          zoom: 0
        },
        mapPreferences: {
          baseLayer: 'blueMarble',
          latitude: 39,
          longitude: -95,
          overlayLayers: [
            'referenceFeatures',
            'referenceLabels'
          ],
          projection: 'epsg4326',
          rotation: 1,
          zoom: 4
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?base=landWaterMap&lat=10&long=15&overlays=referenceFeatures&rotation=0&zoom=0')
    })

    test('does not encode the map when it matches the map preferences', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            blueMarble: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 39,
          longitude: -95,
          overlays: {
            referenceFeatures: true,
            coastlines: false,
            referenceLabels: false
          },
          rotation: 1,
          zoom: 4
        },
        mapPreferences: {
          baseLayer: 'landWaterMap',
          latitude: 39,
          longitude: -95,
          overlayLayers: [
            'referenceFeatures'
          ],
          projection: 'epsg4326',
          rotation: 1,
          zoom: 4
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })
  })
})
