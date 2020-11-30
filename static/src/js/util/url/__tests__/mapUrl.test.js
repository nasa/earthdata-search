import projections from '../../map/projections'

import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes map correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
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
        zoom: 2
      }
    }
    expect(decodeUrlParams('?m=0!0!2!1!0!0%2C2')).toEqual(expectedResult)
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
        latitude: '0',
        longitude: '0',
        overlays: {
          referenceFeatures: true,
          coastlines: false,
          referenceLabels: true
        },
        projection: projections.geographic,
        zoom: '2'
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
          zoom: 0
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?m=10!15!0!1!2!0')
    })
  })
})
