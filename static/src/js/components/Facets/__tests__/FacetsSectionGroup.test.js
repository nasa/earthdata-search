import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import FacetsGroup from '../FacetsGroup'

Enzyme.configure({ adapter: new Adapter() })

const setup = (overrideProps) => {
  const props = {
    facet: {
      children: [],
      totalSelected: 0,
      changeHandler: jest.fn()
    },
    facetCategory: 'Test Category',
    onTriggerViewAllFacets: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<FacetsGroup {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FacetsGroup component', () => {
  describe('renders correctly', () => {
    test('renders the group', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper).toBeDefined()
    })

    test('does not render the children by default', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.facets-group__body').length).toEqual(0)
    })
  })

  describe('when the group is clicked', () => {
    test('when rendering valid facets', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.find('.facets-group__button').simulate('click')
      expect(enzymeWrapper.find('.facets-group__body').length).toEqual(1)
    })
  })

  describe('when there are selected facets', () => {
    test('displays the number of selected facets', () => {
      const { enzymeWrapper } = setup({
        facet: {
          children: new Array(10),
          totalSelected: 9,
          changeHandler: jest.fn()
        }
      })
      enzymeWrapper.setState({ isOpen: true })
      expect(enzymeWrapper.find('.facets-group__selected-count').text()).toEqual('9 Selected')
    })
  })

  describe('when there are more than 50 items', () => {
    test('displays a view all facets link', () => {
      const { enzymeWrapper } = setup({
        facet: {
          children: new Array(51),
          totalSelected: 0,
          changeHandler: jest.fn()
        }
      })
      enzymeWrapper.setState({ isOpen: true })
      expect(enzymeWrapper.find('.facets-group__meta').text()).toEqual('Showing Top 50')
    })
  })

  describe('when clicking the view all facets link', () => {
    test('fires the action to open the modal', () => {
      const { enzymeWrapper, props } = setup({
        facet: {
          children: new Array(51),
          totalSelected: 0,
          changeHandler: jest.fn()
        }
      })
      enzymeWrapper.setState({ isOpen: true })

      enzymeWrapper.find('.facets-group__view-all').simulate('click')
      expect(props.onTriggerViewAllFacets).toHaveBeenCalledTimes(1)
      expect(props.onTriggerViewAllFacets).toHaveBeenCalledWith(undefined)
    })
  })
})
