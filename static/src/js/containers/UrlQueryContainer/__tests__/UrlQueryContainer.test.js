import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { UrlQueryContainer } from '../UrlQueryContainer'
import * as encodeUrlQuery from '../../../util/url/url'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    boundingBoxSearch: '',
    collectionsMetadata: {},
    gridName: '',
    gridCoords: '',
    featureFacets: {},
    focusedCollection: '',
    focusedGranule: '',
    instrumentFacets: {},
    granuleDataFormatFacets: {},
    keywordSearch: '',
    map: {},
    organizationFacets: {},
    overrideTemporalSearch: {},
    pathname: '',
    platformFacets: {},
    pointSearch: '',
    polygonSearch: '',
    processingLevelFacets: {},
    project: {},
    projectFacets: {},
    scienceKeywordFacets: {},
    search: '?p=C00001-EDSC',
    temporalSearch: {},
    timeline: {},
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
        search: '?p=C00001-EDSC&q=test'
      })

      expect(props.onChangeUrl.mock.calls.length).toBe(0)
    })
  })
})
