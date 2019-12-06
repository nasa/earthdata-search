import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form } from 'react-bootstrap'

import CollectionResultsHeader from '../CollectionResultsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup(propsOverride) {
  const props = {
    collectionQuery: {},
    portal: {},
    onChangeQuery: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn(),
    ...propsOverride
  }

  const enzymeWrapper = shallow(<CollectionResultsHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsHeader component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toEqual('div')
    expect(enzymeWrapper.props().className).toEqual('collection-results-header')
  })

  describe('advanced search button', () => {
    test('fires the action to open the advanced search modal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.collection-results-header__adv-search-btn').simulate('click')

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(true)
    })
  })

  describe('portal config', () => {
    test('hides the checkboxes if the portal hides them', () => {
      const { enzymeWrapper } = setup({
        portal: {
          hideCollectionFilters: true
        }
      })

      expect(enzymeWrapper.find(Form.Check).length).toBe(0)
    })
  })

  describe('filtering', () => {
    test('selecting a new option for sorting calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const select = enzymeWrapper.find(Form.Control)
      select.simulate('change', {
        target: {
          value: '-ongoing'
        }
      })

      expect(props.onChangeQuery).toBeCalledTimes(1)
      expect(props.onChangeQuery).toBeCalledWith({
        collection: {
          sortKey: ['-ongoing']
        }
      })

      expect(props.onMetricsCollectionSortChange).toBeCalledTimes(1)
      expect(props.onMetricsCollectionSortChange).toBeCalledWith({
        value: '-ongoing'
      })
    })

    test('selecting Relevance for sorting calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const select = enzymeWrapper.find(Form.Control)
      select.simulate('change', {
        target: {
          value: 'relevance'
        }
      })

      expect(props.onChangeQuery).toBeCalledTimes(1)
      expect(props.onChangeQuery).toBeCalledWith({
        collection: {
          sortKey: undefined
        }
      })
    })

    test('checking "Only include collections with granules" calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const checkbox = enzymeWrapper.find('#input__only-granules')
      checkbox.simulate('change', {
        target: {
          checked: true,
          id: 'input__only-granules'
        }
      })

      expect(props.onChangeQuery).toBeCalledTimes(1)
      expect(props.onChangeQuery).toBeCalledWith({
        collection: {
          hasGranulesOrCwic: true
        }
      })
    })

    test('unchecking "Only include collections with granules" calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const checkbox = enzymeWrapper.find('#input__only-granules')
      checkbox.simulate('change', {
        target: {
          checked: false,
          id: 'input__only-granules'
        }
      })

      expect(props.onChangeQuery).toBeCalledTimes(1)
      expect(props.onChangeQuery).toBeCalledWith({
        collection: {
          hasGranulesOrCwic: undefined
        }
      })
    })

    test('checking "Include non-EOSDIS collections" calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const checkbox = enzymeWrapper.find('#input__non-eosdis')
      checkbox.simulate('change', {
        target: {
          checked: true,
          id: 'input__non-eosdis'
        }
      })

      expect(props.onChangeQuery).toBeCalledTimes(1)
      expect(props.onChangeQuery).toBeCalledWith({
        collection: {
          tagKey: undefined
        }
      })
    })

    test('unchecking "Include non-EOSDIS collections" calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const checkbox = enzymeWrapper.find('#input__non-eosdis')
      checkbox.simulate('change', {
        target: {
          checked: false,
          id: 'input__non-eosdis'
        }
      })

      expect(props.onChangeQuery).toBeCalledTimes(1)
      expect(props.onChangeQuery).toBeCalledWith({
        collection: {
          tagKey: 'gov.nasa.eosdis'
        }
      })
    })
  })
})
