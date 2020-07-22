import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form } from 'react-bootstrap'

import CollectionResultsHeader from '../CollectionResultsHeader'
import Skeleton from '../../Skeleton/Skeleton'

Enzyme.configure({ adapter: new Adapter() })

function setup(propsOverride) {
  const props = {
    collections: {
      allIds: [],
      hits: null,
      isLoading: true,
      isLoaded: false
    },
    collectionQuery: {
      pageNum: 1
    },
    panelView: 'list',
    portal: {
      ui: {
        showOnlyGranulesCheckbox: true,
        showNonEosdisCheckbox: true
      }
    },
    onChangePanelView: jest.fn(),
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

  describe('collection hits', () => {
    test('do not render when not provided', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-results-header__collection-count').length).toEqual(1)
      expect(enzymeWrapper.find(Skeleton).length).toEqual(1)
    })

    test('renders correctly when provided', () => {
      const { enzymeWrapper } = setup({
        collections: {
          allIds: ['ID1', 'ID2'],
          hits: '2',
          isLoading: false,
          isLoaded: true
        }
      })

      expect(enzymeWrapper.find('.collection-results-header__collection-count').length).toEqual(1)
      expect(enzymeWrapper.find('.collection-results-header__collection-count').text()).toEqual('Showing 2 of 2 matching collections')
    })
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
    test('hides the only granules checkbox', () => {
      const { enzymeWrapper } = setup({
        portal: {
          ui: {
            showOnlyGranulesCheckbox: false,
            showNonEosdisCheckbox: true
          }
        }
      })

      const checkbox = enzymeWrapper.find(Form.Check)

      expect(checkbox.length).toBe(1)
      expect(checkbox.props().id).toEqual('input__non-eosdis')
    })

    test('hides the non-eosdis checkbox', () => {
      const { enzymeWrapper } = setup({
        portal: {
          ui: {
            showOnlyGranulesCheckbox: true,
            showNonEosdisCheckbox: false
          }
        }
      })

      const checkbox = enzymeWrapper.find(Form.Check)

      expect(checkbox.length).toBe(1)
      expect(checkbox.props().id).toEqual('input__only-granules')
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
