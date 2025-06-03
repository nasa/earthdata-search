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

const setup = setupTest({
  Component: UrlQueryContainer,
  defaultProps: {
    children: 'stuff',
    boundingBoxSearch: '',
    collectionsMetadata: {},
    gridCoords: '',
    featureFacets: {},
    focusedCollection: '',
    focusedGranule: '',
    horizontalDataResolutionRangeFacets: {},
    instrumentFacets: {},
    granuleDataFormatFacets: {},
    keywordSearch: '',
    mapPreferences: {},
    organizationFacets: {},
    overrideTemporalSearch: {},
    platformFacets: {},
    pointSearch: '',
    polygonSearch: '',
    portalId: '',
    processingLevelFacets: {},
    project: {},
    projectFacets: {},
    scienceKeywordFacets: {},
    temporalSearch: {},
    twoDCoordinateSystemNameFacets: [],
    onChangePath: jest.fn(),
    onChangeUrl: jest.fn()
  },
  defaultZustandState: {
    location: {
      location: {
        search: '?p=C00001-EDSC'
      }
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
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
      autocomplete: {
        selected: []
      },
      earthdataEnvironment: 'prod',
      facetsParams: {
        cmr: {
          granule_data_format_h: [],
          horizontal_data_resolution_range: [],
          instrument_h: [],
          data_center_h: [],
          platforms_h: [],
          processing_level_id_h: [],
          project_h: [],
          science_keywords_h: [],
          two_d_coordinate_system_name: []
        },
        feature: {}
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      metadata: {
        collections: {}
      },
      portal: {
        portalId: 'edsc'
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
      }
    }

    const expectedState = {
      advancedSearch: {},
      autocompleteSelected: [],
      boundingBoxSearch: [],
      circleSearch: [],
      collectionsMetadata: {},
      earthdataEnvironment: 'prod',
      featureFacets: {},
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      granuleDataFormatFacets: [],
      hasGranulesOrCwic: false,
      horizontalDataResolutionRangeFacets: [],
      instrumentFacets: [],
      keywordSearch: '',
      lineSearch: [],
      mapPreferences: {},
      organizationFacets: [],
      overrideTemporalSearch: {},
      platformFacets: [],
      pointSearch: [],
      polygonSearch: [],
      portalId: 'edsc',
      processingLevelFacets: [],
      project: {},
      projectFacets: [],
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
      scienceKeywordFacets: [],
      paramCollectionSortKey: undefined,
      tagKey: '',
      temporalSearch: {},
      twoDCoordinateSystemNameFacets: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })

  test('returns the correct state when using collectionSortKeys.endDateDescending', () => {
    const store = {
      advancedSearch: {},
      autocomplete: {
        selected: []
      },
      earthdataEnvironment: 'prod',
      facetsParams: {
        cmr: {
          granule_data_format_h: [],
          horizontal_data_resolution_range: [],
          instrument_h: [],
          data_center_h: [],
          platforms_h: [],
          processing_level_id_h: [],
          project_h: [],
          science_keywords_h: [],
          two_d_coordinate_system_name: []
        },
        feature: {}
      },
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      metadata: {
        collections: {}
      },
      portal: {
        portalId: 'edsc'
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
      }
    }

    const expectedState = {
      advancedSearch: {},
      autocompleteSelected: [],
      boundingBoxSearch: [],
      circleSearch: [],
      collectionsMetadata: {},
      earthdataEnvironment: 'prod',
      featureFacets: {},
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleIdId',
      granuleDataFormatFacets: [],
      hasGranulesOrCwic: false,
      horizontalDataResolutionRangeFacets: [],
      instrumentFacets: [],
      keywordSearch: '',
      lineSearch: [],
      mapPreferences: {},
      organizationFacets: [],
      overrideTemporalSearch: {},
      platformFacets: [],
      pointSearch: [],
      polygonSearch: [],
      portalId: 'edsc',
      processingLevelFacets: [],
      project: {},
      projectFacets: [],
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
      scienceKeywordFacets: [],
      paramCollectionSortKey: collectionSortKeys.endDateDescending,
      tagKey: '',
      temporalSearch: {},
      twoDCoordinateSystemNameFacets: []
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

      expect(props.onChangePath).toHaveBeenCalledWith('/?p=C00001-EDSC')
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
