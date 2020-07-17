import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { VariableSizeList as List } from 'react-window'

import CollectionResultsList from '../CollectionResultsList'
import CollectionResultsItem from '../CollectionResultsItem'

Enzyme.configure({ adapter: new Adapter() })

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

beforeEach(() => {
  jest.clearAllMocks()

  // The AutoSizer requires that the offsetHeight and offsetWidth properties are set
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 500 })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })
})

afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
})

const defaultProps = {
  collections: [{
    datasetId: 'Collection Title 1',
    collectionId: 'collectionId1'
  }, {
    datasetId: 'Collection Title 2',
    collectionId: 'collectionId2'
  }],
  itemCount: 2,
  isItemLoaded: jest.fn(),
  loadMoreItems: jest.fn(),
  onAddProjectCollection: jest.fn(),
  onRemoveCollectionFromProject: jest.fn(),
  onViewCollectionGranules: jest.fn(),
  onViewCollectionDetails: jest.fn(),
  portal: {
    features: {
      authentication: true
    }
  },
  setVisibleMiddleIndex: jest.fn(),
  visibleMiddleIndex: 1
}

function setup(mountType, propsOverride = {}) {
  const props = {
    ...defaultProps,
    ...propsOverride
  }

  const enzymeWrapper = mountType(<CollectionResultsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup(mount)

    expect(enzymeWrapper.type()).toBe(CollectionResultsList)
  })

  test('renders its list correctly', () => {
    const { enzymeWrapper } = setup(mount)

    expect(enzymeWrapper.find('.collection-results-list__list').children().length).toEqual(2)
  })

  test('should pass the height and width', () => {
    const { enzymeWrapper } = setup(mount)

    expect(enzymeWrapper.find(List).prop('height')).toEqual(500)
    expect(enzymeWrapper.find(List).prop('width')).toEqual(800)
  })

  describe('loading list item', () => {
    test('shows on first load', () => {
      defaultProps.isItemLoaded
        .mockReturnValueOnce(false)

      const { enzymeWrapper } = setup(mount, {
        collections: [],
        itemCount: 1
      })

      expect(enzymeWrapper.find('.collection-results-list__list').children().length).toEqual(1)
      expect(enzymeWrapper.find('.collection-results-list__list').text()).toEqual('Loading collections...')
    })

    test('shows when additional items are being loaded', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValue(false)

      const { enzymeWrapper } = setup(mount, {
        itemCount: 3,
        isItemLoaded: isItemLoadedMock
      })

      expect(enzymeWrapper.find('.collection-results-list__list').children().length).toEqual(3)
      expect(enzymeWrapper.find(CollectionResultsItem).length).toEqual(2)
      expect(enzymeWrapper.find('.collection-results-list__list').text()).toContain('Collection Title 1')
      expect(enzymeWrapper.find('.collection-results-list__list').text()).toContain('Collection Title 2')
      expect(enzymeWrapper.find('.collection-results-list__list').text()).toContain('Loading collections...')
    })

    test('does not show the loading item when items are loaded', () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      const { enzymeWrapper } = setup(mount, {
        itemCount: 2,
        isItemLoaded: isItemLoadedMock
      })

      expect(enzymeWrapper.find('.collection-results-list__list').children().length).toEqual(2)
      expect(enzymeWrapper.find(CollectionResultsItem).length).toEqual(2)
      expect(enzymeWrapper.find('.collection-results-list__list').text()).toContain('Collection Title 1')
      expect(enzymeWrapper.find('.collection-results-list__list').text()).toContain('Collection Title 2')
      expect(enzymeWrapper.find('.collection-results-list__list').text()).not.toContain('Loading collections...')
    })
  })
})
