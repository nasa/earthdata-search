import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { OverlayTrigger } from 'react-bootstrap'
import GranuleResultsHeader from '../GranuleResultsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    focusedCollectionMetadata: {
      collectionId: {
        excludedGranuleIds: [],
        metadata: {
          dataset_id: 'Title'
        }
      }
    },
    location: {
      search: '?test=search-value'
    },
    onUpdateSortOrder: jest.fn(),
    onUpdateSearchValue: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    sortOrder: 'start_date_newest_first',
    searchValue: 'searchValue',
    collectionSearch: {}
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
    const input = overlayTrigger.find('#input__granule-search')

    expect(overlayTrigger.length).toEqual(1)
    expect(input.length).toEqual(1)
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

      expect(enzymeWrapper.state()).toEqual({ searchValue: 'searchValue', sortOrder: 'start_date_oldest_first' })
    })

    test('fires the onUpdateSortOrder', () => {
      const { enzymeWrapper, props } = setup()
      const mockEvent = {
        target: {
          value: 'start_date_oldest_first'
        }
      }
      enzymeWrapper.find('#input__sort-granules').simulate('change', mockEvent)

      expect(props.onUpdateSortOrder).toHaveBeenCalledTimes(1)
      expect(props.onUpdateSortOrder).toHaveBeenCalledWith('start_date_oldest_first')
    })
  })

  describe('handleUpdateSearchValue', () => {
    test('sets the state correctly', () => {
      const { enzymeWrapper } = setup()
      const mockEvent = {
        target: {
          value: 'Some new value'
        }
      }
      enzymeWrapper.find('#input__granule-search').simulate('change', mockEvent)

      expect(enzymeWrapper.state()).toEqual({ searchValue: 'Some new value', sortOrder: 'start_date_newest_first' })
    })

    test('fires the onUpdateSearchValue', () => {
      const { enzymeWrapper, props } = setup()
      const mockEvent = {
        target: {
          value: 'Some new value'
        }
      }
      enzymeWrapper.find('#input__granule-search').simulate('change', mockEvent)

      expect(props.onUpdateSearchValue).toHaveBeenCalledTimes(1)
      expect(props.onUpdateSearchValue).toHaveBeenCalledWith('Some new value')
    })
  })
})

describe('handleUndoExcludeGranule', () => {
  test('fires onUndoExcludeGranule', () => {
    const { enzymeWrapper, props } = setup()

    // Exclude a granule to test undo button
    enzymeWrapper.setProps({
      focusedCollectionMetadata: {
        collectionId: {
          excludedGranuleIds: ['granuleId1', 'granuleId2'],
          metadata: {
            title: 'Title'
          }
        }
      }
    })

    enzymeWrapper.find('.granule-results-header__granule-undo-button').simulate('click')

    expect(props.onUndoExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.onUndoExcludeGranule).toHaveBeenCalledWith('collectionId')
  })
})
