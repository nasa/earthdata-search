import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import axios from 'axios'
import { act } from 'react-dom/test-utils'

import { VariableSizeList as List } from 'react-window'

import CollectionResultsList from '../CollectionResultsList'
import CollectionResultsItem from '../CollectionResultsItem'

import Skeleton from '../../Skeleton/Skeleton'

import configureStore from '../../../store/configureStore'

Enzyme.configure({ adapter: new Adapter() })
jest.mock('../../../../assets/images/image-unavailable.svg', () => 'test-file-stub')
jest.mock('axios')

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

beforeEach(() => {
  jest.clearAllMocks()

  // The AutoSizer requires that the offsetHeight and offsetWidth properties are set
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 500
  })

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 800
  })
})

afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
})

const defaultProps = {
  collectionsMetadata: [{
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
  onMetricsAddCollectionProject: jest.fn(),
  onRemoveCollectionFromProject: jest.fn(),
  onViewCollectionGranules: jest.fn(),
  onViewCollectionDetails: jest.fn(),
  setVisibleMiddleIndex: jest.fn(),
  visibleMiddleIndex: 1
}

const store = configureStore()

function setup(propsOverride = {}) {
  const props = {
    ...defaultProps,
    ...propsOverride
  }

  const enzymeWrapper = mount(
    <Provider store={store}>
      <CollectionResultsList {...props} />
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsList component', () => {
  test('renders its list correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.collection-results-list__list').children().length).toEqual(2)
  })

  test('should pass the height and width', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(List).prop('height')).toEqual(500)
    expect(enzymeWrapper.find(List).prop('width')).toEqual(800)
  })

  describe('loading list item', () => {
    test('shows on first load', () => {
      defaultProps.isItemLoaded
        .mockReturnValueOnce(false)

      const { enzymeWrapper } = setup({
        collectionsMetadata: [],
        itemCount: 1
      })

      expect(enzymeWrapper.find('.collection-results-list__list').children().length).toEqual(1)
      expect(enzymeWrapper.find(Skeleton).length).toEqual(1)
    })

    test('shows when additional items are being loaded', async () => {
      axios.get.mockResolvedValue({
        data: {
          base64Image: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
          'content-type': 'image/png'
        }
      })

      const isItemLoadedMock = jest.fn((index) => {
        if (index === 2) return false

        return true
      })
      let enzymeWrapperRef

      await act(async () => {
        const { enzymeWrapper } = setup({
          itemCount: 3,
          isItemLoaded: isItemLoadedMock
        })
        enzymeWrapperRef = enzymeWrapper
      })

      enzymeWrapperRef.update()
      expect(enzymeWrapperRef.find('.collection-results-list__list').children().length).toEqual(3)

      expect(enzymeWrapperRef.find(CollectionResultsItem).length).toEqual(2)
      expect(enzymeWrapperRef.find('.collection-results-list__list').text()).toContain('Collection Title 1')
      expect(enzymeWrapperRef.find('.collection-results-list__list').text()).toContain('Collection Title 2')
      expect(enzymeWrapperRef.find(Skeleton).length).toEqual(1)
    })

    test('does not show the loading item when items are loaded', async () => {
      const isItemLoadedMock = jest.fn()
        .mockReturnValue(true)

      let enzymeWrapperRef

      await act(async () => {
        const { enzymeWrapper } = setup({
          itemCount: 2,
          isItemLoaded: isItemLoadedMock
        })
        enzymeWrapperRef = enzymeWrapper
      })

      enzymeWrapperRef.update()

      expect(enzymeWrapperRef.find('.collection-results-list__list').children().length).toEqual(2)
      expect(enzymeWrapperRef.find(CollectionResultsItem).length).toEqual(2)
      expect(enzymeWrapperRef.find('.collection-results-list__list').text()).toContain('Collection Title 1')
      expect(enzymeWrapperRef.find('.collection-results-list__list').text()).toContain('Collection Title 2')
      expect(enzymeWrapperRef.find(Skeleton).length).toEqual(0)
    })
  })
})
