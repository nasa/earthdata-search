import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  UrlQueryContainer
} from '../UrlQueryContainer'
import * as encodeUrlQuery from '../../../util/url/url'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
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
    map: {},
    mapPreferences: {},
    organizationFacets: {},
    overrideTemporalSearch: {},
    pathname: '',
    platformFacets: {},
    pointSearch: '',
    polygonSearch: '',
    portalId: '',
    processingLevelFacets: {},
    project: {},
    projectFacets: {},
    location: {
      search: '?p=C00001-EDSC'
    },
    scienceKeywordFacets: {},
    temporalSearch: {},
    timeline: {},
    twoDCoordinateSystemNameFacets: [],
    onChangePath: jest.fn(),
    onChangeUrl: jest.fn()
  }

  const enzymeWrapper = shallow(<UrlQueryContainer {...props}>stuff</UrlQueryContainer>)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('path')
  })

  test('onChangeUrl calls actions.changeUrl', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeUrl')

    mapDispatchToProps(dispatch).onChangeUrl('query')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('query')
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
      map: {},
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
      },
      router: {
        location: {
          pathname: ''
        }
      },
      shapefile: {
        selectedFeatures: [],
        shapefileId: ''
      },
      timeline: {
        query: {}
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
      location: {
        pathname: ''
      },
      map: {},
      mapPreferences: {},
      organizationFacets: [],
      overrideTemporalSearch: {},
      pathname: '',
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
      selectedFeatures: [],
      shapefileId: '',
      paramCollectionSortKey: undefined,
      tagKey: '',
      temporalSearch: {},
      twoDCoordinateSystemNameFacets: [],
      timelineQuery: {}
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
      map: {},
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
      },
      router: {
        location: {
          pathname: ''
        }
      },
      shapefile: {
        selectedFeatures: [],
        shapefileId: ''
      },
      timeline: {
        query: {}
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
      location: {
        pathname: ''
      },
      map: {},
      mapPreferences: {},
      organizationFacets: [],
      overrideTemporalSearch: {},
      pathname: '',
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
      selectedFeatures: [],
      shapefileId: '',
      paramCollectionSortKey: collectionSortKeys.endDateDescending,
      tagKey: '',
      temporalSearch: {},
      twoDCoordinateSystemNameFacets: [],
      timelineQuery: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('UrlQueryContainer', () => {
  describe('componentDidMount', () => {
    test('calls onChangePath on page load', () => {
      const { props } = setup()

      expect(props.onChangePath.mock.calls.length).toBe(1)
      expect(props.onChangePath.mock.calls[0]).toEqual(['?p=C00001-EDSC'])
    })
  })

  describe('componentWillReceiveProps', () => {
    test('calls onChangeUrl if the search params are the same', () => {
      jest.spyOn(encodeUrlQuery, 'encodeUrlQuery').mockImplementation(() => '?p=C00001-EDSC&q=test')

      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setProps({
        ...props,
        keywordSearch: 'test'
      })

      expect(props.onChangeUrl.mock.calls.length).toBe(1)
      expect(props.onChangeUrl.mock.calls[0]).toEqual(['?p=C00001-EDSC&q=test'])
    })

    test('does not call onChangeUrl if the search params are different', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.setProps({
        ...props,
        location: {
          search: '?p=C00001-EDSC&q=test'
        }
      })

      expect(props.onChangeUrl.mock.calls.length).toBe(0)
    })
  })
})
