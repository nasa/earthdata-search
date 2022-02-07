import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Facets from '../Facets'
import FacetsGroup from '../FacetsGroup'
import * as facetUtils from '../../../util/facets'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    facetsById: {
      Keywords: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_keyword_link'
          },
          title: 'Mock Keyword Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Keywords',
        totalSelected: 0,
        type: 'group'
      },
      Platforms: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_platform_link'
          },
          title: 'Mock Platform Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Platforms',
        totalSelected: 0,
        type: 'group'
      },
      Instruments: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_instrument_link'
          },
          title: 'Mock Instrument Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Instruments',
        totalSelected: 0,
        type: 'group'
      },
      Organizations: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_organization_link'
          },
          title: 'Mock Organization Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Organizations',
        totalSelected: 0,
        type: 'group'
      },
      Projects: {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_project_link'
          },
          title: 'Mock Project Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Projects',
        totalSelected: 0,
        type: 'group'
      },
      'Processing Levels': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_processing_level_link'
          },
          title: 'Mock Processing Level Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Processing Levels',
        totalSelected: 0,
        type: 'group'
      },
      'Data Format': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_data_format_link'
          },
          title: 'Mock Data Format Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Data Format',
        totalSelected: 0,
        type: 'group'
      },
      'Tiling System': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_tiling_system_link'
          },
          title: 'Mock Tiling System Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Tiling System',
        totalSelected: 0,
        type: 'group'
      },
      'Horizontal Data Resolution': {
        applied: false,
        children: [{
          applied: false,
          count: 1,
          has_children: false,
          links: {
            apply: 'http://example.com/apply_horizontal_data_resolution_link'
          },
          title: 'Mock Horizontal Data Resolution Facet',
          type: 'filter'
        }],
        hasChildren: true,
        title: 'Horizontal Data Resolution',
        totalSelected: 0,
        type: 'group'
      }
    },
    featureFacets: {
      availableFromAwsCloud: false,
      customizable: false,
      mapImagery: false,
      nearRealTime: false
    },
    portal: {
      features: {
        featureFacets: {
          showAvailableFromAwsCloud: true,
          showCustomizable: true,
          showMapImagery: true,
          showNearRealTime: true
        }
      }
    },
    onChangeCmrFacet: jest.fn(),
    onChangeFeatureFacet: jest.fn(),
    onTriggerViewAllFacets: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Facets {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Facets component', () => {
  test('only renders enabled feature FacetsGroup', () => {
    const { enzymeWrapper } = setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: false,
            showNearRealTime: true,
            showCustomizable: false
          }
        }
      }
    })

    const featuresGroup = enzymeWrapper.find(FacetsGroup).first()
    expect(featuresGroup.props().facet.title).toEqual('Features')
    expect(featuresGroup.props().facet.options).toEqual({ isOpen: true })
    expect(featuresGroup.props().facet.children.length).toEqual(1)
    expect(featuresGroup.props().facet.children[0]).toEqual({
      applied: false,
      title: 'Near Real Time',
      type: 'feature'
    })
  })

  test('does not render features FacetsGroup if all feature facets are disabled', () => {
    const { enzymeWrapper } = setup({
      portal: {
        features: {
          featureFacets: {
            showMapImagery: false,
            showNearRealTime: false,
            showCustomizable: false
          }
        }
      }
    })

    const facetsGroups = enzymeWrapper.find(FacetsGroup)

    expect(facetsGroups.first().props().facetCategory).not.toEqual('features')
  })

  test('renders keywords FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(1)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('science_keywords')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.options).toEqual({ liftSelectedFacets: true })
    expect(facetsGroup.props().facet.title).toEqual('Keywords')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_keyword_link' },
      title: 'Mock Keyword Facet',
      type: 'filter'
    }])
  })

  test('renders platforms FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(2)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('platform')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Platforms')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_platform_link' },
      title: 'Mock Platform Facet',
      type: 'filter'
    }])
  })

  test('renders instruments FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(3)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('instrument')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Instruments')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_instrument_link' },
      title: 'Mock Instrument Facet',
      type: 'filter'
    }])
  })

  test('renders organizations FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(4)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('organization')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Organizations')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_organization_link' },
      title: 'Mock Organization Facet',
      type: 'filter'
    }])
  })

  test('renders projects FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(5)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('project')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Projects')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_project_link' },
      title: 'Mock Project Facet',
      type: 'filter'
    }])
  })

  test('renders processing levels FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(6)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('processing_level_id')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Processing Levels')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_processing_level_link' },
      title: 'Mock Processing Level Facet',
      type: 'filter'
    }])
  })

  test('renders data format FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(7)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('granule_data_format')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Data Format')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_data_format_link' },
      title: 'Mock Data Format Facet',
      type: 'filter'
    }])
  })

  test('renders tiling system FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(8)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('two_d_coordinate_system_name')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Tiling System')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_tiling_system_link' },
      title: 'Mock Tiling System Facet',
      type: 'filter'
    }])
  })

  test('renders horizontal data resolution FacetsGroup', () => {
    const { enzymeWrapper } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(9)

    expect(facetsGroup.props().facet.applied).toEqual(false)
    expect(facetsGroup.props().facet.autocompleteType).toEqual('horizontal_data_resolution')
    expect(facetsGroup.props().facet.hasChildren).toEqual(true)
    expect(facetsGroup.props().facet.title).toEqual('Horizontal Data Resolution')
    expect(facetsGroup.props().facet.totalSelected).toEqual(0)
    expect(facetsGroup.props().facet.children).toEqual([{
      applied: false,
      count: 1,
      has_children: false,
      links: { apply: 'http://example.com/apply_horizontal_data_resolution_link' },
      title: 'Mock Horizontal Data Resolution Facet',
      type: 'filter'
    }])
  })

  test('featureFacetHandler calls changeFeatureFacet', () => {
    const mock = jest.spyOn(facetUtils, 'changeFeatureFacet').mockImplementationOnce(() => jest.fn())

    const { enzymeWrapper, props } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(0)

    facetsGroup.props().facet.changeHandler(
      {},
      {
        destination: null,
        title: 'Near Real Time'
      }
    )

    expect(mock).toBeCalledWith(
      {},
      {
        destination: null,
        title: 'Near Real Time'
      },
      props.onChangeFeatureFacet
    )
  })

  test('cmrFacetHandler calls changeCmrFacet', () => {
    const mock = jest.spyOn(facetUtils, 'changeCmrFacet').mockImplementationOnce(() => jest.fn())

    const { enzymeWrapper, props } = setup()

    const facetsGroup = enzymeWrapper.find(FacetsGroup).at(1)

    facetsGroup.props().facet.changeHandler(
      {},
      {
        destination: 'http://example.com/apply_keyword_link',
        title: 'Mock Keyword Facet'
      },
      {
        level: 0,
        type: 'science_keywords',
        value: 'Mock Keyword Facet'
      },
      true
    )

    expect(mock).toBeCalledWith(
      {},
      {
        destination: 'http://example.com/apply_keyword_link',
        title: 'Mock Keyword Facet'
      },
      props.onChangeCmrFacet,
      {
        level: 0,
        type: 'science_keywords',
        value: 'Mock Keyword Facet'
      },
      true
    )
  })
})
