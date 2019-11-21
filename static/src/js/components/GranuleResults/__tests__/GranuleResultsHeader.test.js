import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { OverlayTrigger } from 'react-bootstrap'
import GranuleResultsHeader from '../GranuleResultsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    focusedCollectionId: 'collectionId',
    focusedCollectionObject: {
      excludedGranuleIds: [],
      granuleFilters: {
        readableGranuleName: 'searchValue',
        sortKey: '-start_date'
      },
      metadata: {
        dataset_id: 'Title',
        id: 'collectionId'
      }
    },
    location: {
      search: '?test=search-value'
    },
    collectionSearch: {},
    secondaryOverlayPanel: {
      isOpen: false
    },
    onApplyGranuleFilters: jest.fn(),
    onToggleSecondaryOverlayPanel: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsHeader component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
  })

  test('renders a title', () => {
    const { enzymeWrapper } = setup()
    const title = enzymeWrapper.find('.granule-results-header__title')

    expect(title.text()).toEqual('Title')
  })

  test('renders the granule sort', () => {
    const { enzymeWrapper } = setup()
    const element = enzymeWrapper.find('#input__sort-granules')

    expect(element.length).toEqual(1)
  })

  test('renders the granule search', () => {
    const { enzymeWrapper } = setup()
    const element = enzymeWrapper.find('#input__granule-search')

    expect(element.length).toEqual(1)
  })

  test('renders the granule search with a tooltip', () => {
    const { enzymeWrapper } = setup()
    const overlayTrigger = enzymeWrapper.find(OverlayTrigger)

    expect(overlayTrigger.length).toEqual(1)
  })

  describe('handleUpdateSortOrder', () => {
    test('sets the state correctly', () => {
      const { enzymeWrapper } = setup()
      const mockEvent = {
        target: {
          value: 'start_date_oldest_first'
        }
      }
      enzymeWrapper.find('#input__sort-granules').simulate('change', mockEvent)

      expect(enzymeWrapper.state()).toEqual({
        prevSearchValue: 'searchValue',
        searchValue: 'searchValue',
        sortOrder: 'start_date_oldest_first'
      })
    })

    test('fires the onApplyGranuleFilters', () => {
      const { enzymeWrapper, props } = setup()
      const mockEvent = {
        target: {
          value: 'start_date_oldest_first'
        }
      }
      enzymeWrapper.find('#input__sort-granules').simulate('change', mockEvent)

      expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
      expect(props.onApplyGranuleFilters).toHaveBeenCalledWith('collectionId', { readableGranuleName: 'searchValue', sortKey: 'start_date_oldest_first' })
    })
  })

  describe('handleUpdateSearchValue', () => {
    test('sets the state correctly', () => {
      const { enzymeWrapper } = setup()
      const mockEvent = {
        target: {
          value: 'Some-new-value'
        }
      }
      enzymeWrapper.find('#input__granule-search').simulate('change', mockEvent)

      enzymeWrapper.update()

      expect(enzymeWrapper.state()).toEqual({
        prevSearchValue: 'searchValue',
        searchValue: 'Some-new-value',
        sortOrder: '-start_date'
      })
    })
  })

  describe('handleBlurSearchValue', () => {
    test('fires the onApplyGranuleFilters', () => {
      const { enzymeWrapper, props } = setup()
      const mockEvent = {
        target: {
          value: 'Some-new-value'
        }
      }
      enzymeWrapper.find('#input__granule-search').simulate('change', mockEvent)
      enzymeWrapper.find('#input__granule-search').simulate('blur')

      expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
      expect(props.onApplyGranuleFilters).toHaveBeenCalledWith('collectionId', { readableGranuleName: ['Some-new-value'], sortKey: '-start_date' })
    })

    test('removes the parameter if the input is empty', () => {
      const { enzymeWrapper, props } = setup()
      const mockEvent = {
        target: {
          value: ''
        }
      }
      enzymeWrapper.find('#input__granule-search').simulate('change', mockEvent)
      enzymeWrapper.find('#input__granule-search').simulate('blur')

      expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
      expect(props.onApplyGranuleFilters).toHaveBeenCalledWith('collectionId', {
        readableGranuleName: null,
        sortKey: '-start_date'
      })
    })
  })
})

describe('handleUndoExcludeGranule', () => {
  test('fires onUndoExcludeGranule', () => {
    const { enzymeWrapper, props } = setup()

    // Exclude a granule to test undo button
    enzymeWrapper.setProps({
      focusedCollectionObject: {
        excludedGranuleIds: ['granuleId1', 'granuleId2'],
        metadata: {
          title: 'Title',
          id: 'collectionId'
        }
      }
    })

    enzymeWrapper.find('.granule-results-header__granule-undo-button').simulate('click')

    expect(props.onUndoExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.onUndoExcludeGranule).toHaveBeenCalledWith('collectionId')
  })
})

describe('granuleFilters link', () => {
  describe('when filters are not active', () => {
    test('displays correct icon when filters are not active', () => {
      const { enzymeWrapper } = setup({
        secondaryOverlayPanel: {
          isOpen: false
        }
      })
      expect(enzymeWrapper.find('.granule-results-header__link').at(1).prop('icon')).toEqual('filter')
    })

    test('fires the correct callback on click', () => {
      const { enzymeWrapper, props } = setup({
        secondaryOverlayPanel: {
          isOpen: false
        }
      })
      enzymeWrapper.find('.granule-results-header__link').at(1).simulate('click')
      expect(props.onToggleSecondaryOverlayPanel).toHaveBeenCalledTimes(1)
      expect(props.onToggleSecondaryOverlayPanel).toHaveBeenCalledWith(true)
    })
  })

  describe('when filters are not active', () => {
    test('displays correct icon when filters are active', () => {
      const { enzymeWrapper } = setup({
        secondaryOverlayPanel: {
          isOpen: true
        }
      })
      expect(enzymeWrapper.find('.granule-results-header__link').at(1).prop('icon')).toEqual('times')
    })

    test('fires the correct callback on click', () => {
      const { enzymeWrapper, props } = setup({
        secondaryOverlayPanel: {
          isOpen: true
        }
      })
      enzymeWrapper.find('.granule-results-header__link').at(1).simulate('click')
      expect(props.onToggleSecondaryOverlayPanel).toHaveBeenCalledTimes(1)
      expect(props.onToggleSecondaryOverlayPanel).toHaveBeenCalledWith(false)
    })
  })
})
