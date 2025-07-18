import React from 'react'
import { act, waitFor } from '@testing-library/react'

import actions from '../../../actions'
import {
  UrlQueryContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../UrlQueryContainer'
import * as encodeUrlQuery from '../../../util/url/url'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import useEdscStore from '../../../zustand/useEdscStore'
import setupTest from '../../../../../../jestConfigs/setupTest'
import * as preferences from '../../../zustand/selectors/preferences'

jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
  env: 'sit',
  collectionSearchResultsSortKey: collectionSortKeys.usageDescending
}))

jest.spyOn(preferences, 'getCollectionSortKeyParameter').mockImplementation(() => null)

const setup = setupTest({
  Component: UrlQueryContainer,
  defaultProps: {
    children: 'stuff',
    boundingBoxSearch: '',
    collectionsMetadata: {},
    gridCoords: '',
    focusedCollection: '',
    focusedGranule: '',
    keywordSearch: '',
    mapPreferences: {},
    overrideTemporalSearch: {},
    pathname: '',
    pointSearch: '',
    polygonSearch: '',
    project: {},
    projectFacets: {},
    location: {
      search: '?p=C00001-EDSC'
    },
    temporalSearch: {},
    onChangePath: jest.fn(),
    onChangeUrl: jest.fn()
  },
  defaultZustandState: {
    preferences: {
      preferences: {
        collectionSort: 'default'
      }
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    collectionSearchResultsSortKey: collectionSortKeys.usageDescending
  }))
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })

  test('onChangeUrl calls actions.changeUrl', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeUrl')

    mapDispatchToProps(dispatch).onChangeUrl('query')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('query')
  })
})

describe('mapStateToProps', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: collectionSortKeys.usageDescending
    }))
  })

  test('returns the correct state', () => {
    const store = {
      advancedSearch: {},
      earthdataEnvironment: 'prod',
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      metadata: {
        collections: {}
      },
      project: {},
      query: {
        collection: {
          hasGranulesOrCwic: false,
          keyword: '',
          overrideTemporal: {},
          sortKey: [collectionSortKeys.usageDescending],
          spatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          },
          tagKey: '',
          temporal: {}
        }
      },
      router: {
        location: {
          pathname: ''
        }
      }
    }

    const expectedState = {
      advancedSearch: {},
      boundingBoxSearch: [],
      circleSearch: [],
      collectionsMetadata: {},
      earthdataEnvironment: 'prod',
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      hasGranulesOrCwic: false,
      keywordSearch: '',
      lineSearch: [],
      location: {
        pathname: ''
      },
      onlyEosdisCollections: undefined,
      overrideTemporalSearch: {},
      pathname: '',
      pointSearch: [],
      polygonSearch: [],
      project: {},
      query: {
        collection: {
          hasGranulesOrCwic: false,
          keyword: '',
          overrideTemporal: {},
          sortKey: ['-usage_score'],
          spatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          },
          tagKey: '',
          temporal: {}
        }
      },
      tagKey: '',
      temporalSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })

  test('returns the correct state when using collectionSortKeys.endDateDescending', () => {
    const store = {
      advancedSearch: {},
      earthdataEnvironment: 'prod',
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      metadata: {
        collections: {}
      },
      project: {},
      query: {
        collection: {
          hasGranulesOrCwic: false,
          keyword: '',
          overrideTemporal: {},
          sortKey: [collectionSortKeys.endDateDescending],
          paramCollectionSortKey: collectionSortKeys.endDateDescending,
          spatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          },
          tagKey: '',
          temporal: {}
        }
      },
      router: {
        location: {
          pathname: ''
        }
      }
    }

    const expectedState = {
      advancedSearch: {},
      boundingBoxSearch: [],
      circleSearch: [],
      collectionsMetadata: {},
      earthdataEnvironment: 'prod',
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      hasGranulesOrCwic: false,
      keywordSearch: '',
      lineSearch: [],
      location: {
        pathname: ''
      },
      onlyEosdisCollections: undefined,
      overrideTemporalSearch: {},
      pathname: '',
      pointSearch: [],
      polygonSearch: [],
      project: {},
      query: {
        collection: {
          hasGranulesOrCwic: false,
          keyword: '',
          overrideTemporal: {},
          sortKey: [collectionSortKeys.endDateDescending],
          paramCollectionSortKey: collectionSortKeys.endDateDescending,
          spatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          },
          tagKey: '',
          temporal: {}
        }
      },
      tagKey: '',
      temporalSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('UrlQueryContainer', () => {
  describe('when the component mounts', () => {
    test('calls onChangePath', async () => {
      jest.spyOn(encodeUrlQuery, 'encodeUrlQuery').mockImplementation(() => '?p=C00001-EDSC')

      const { props } = setup()

      await waitFor(async () => {
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
      })

      expect(props.onChangePath).toHaveBeenCalledWith('?p=C00001-EDSC')
    })
  })

  describe('when the redux props change', () => {
    test('calls onChangeUrl if the search params are the same', () => {
      jest.spyOn(encodeUrlQuery, 'encodeUrlQuery').mockImplementation(() => '?p=C00001-EDSC&q=test')

      const { props, rerender } = setup()

      rerender(
        <UrlQueryContainer
          {...props}
          keywordSearch="test"
        >
          stuff
        </UrlQueryContainer>
      )

      expect(props.onChangeUrl).toHaveBeenCalledTimes(1)
      expect(props.onChangeUrl).toHaveBeenCalledWith('?p=C00001-EDSC&q=test')
    })

    test('does not call onChangeUrl if the search params are different', () => {
      const { props, rerender } = setup()

      jest.clearAllMocks()

      rerender(
        <UrlQueryContainer
          {...props}
          location={
            {
              search: '?p=C00001-EDSC&q=test'
            }
          }
        >
          stuff
        </UrlQueryContainer>
      )

      expect(props.onChangeUrl).toHaveBeenCalledTimes(0)
    })
  })

  describe('when the zustand values change', () => {
    test('calls onChangeUrl if the search params are the same', () => {
      const encodeUrlQuerySpy = jest.spyOn(encodeUrlQuery, 'encodeUrlQuery').mockImplementation(() => '?p=C00001-EDSC&q=test&tl=1571306772.712!5!!')

      const { props } = setup()

      act(() => {
        useEdscStore.setState({
          timeline: {
            query: {
              center: 1571306737483,
              interval: 'decade',
              endDate: '2310-01-01T00:00:00.000Z',
              startDate: '1710-01-01T00:00:00.000Z'
            }
          }
        })
      })

      expect(encodeUrlQuerySpy).toHaveBeenCalledTimes(3)
      expect(encodeUrlQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
        timelineQuery: {
          center: 1571306737483,
          interval: 'decade',
          endDate: '2310-01-01T00:00:00.000Z',
          startDate: '1710-01-01T00:00:00.000Z'
        }
      }))

      expect(props.onChangeUrl).toHaveBeenCalledTimes(1)
      expect(props.onChangeUrl).toHaveBeenCalledWith('?p=C00001-EDSC&q=test&tl=1571306772.712!5!!')
    })
  })
})
