import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import AutoSizer from 'react-virtualized-auto-sizer'

import GranuleResultsList from '../GranuleResultsList'
import GranuleResultsListBody from '../GranuleResultsListBody'

Enzyme.configure({ adapter: new Adapter() })

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

beforeEach(() => {
  jest.clearAllMocks()

  // The AutoSizer requires that the offsetHeight and offsetWidth properties are set
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 500 })
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })

  window.getComputedStyle = jest.fn(() => ({ fontSize: 16 }))
})

afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
})

function setup(type) {
  let props

  // if (type === 'loading') {
  //   props = {
  //     collectionId: 'collectionId',
  //     excludedGranuleIds: [],
  //     focusedGranule: '',
  //     granules: [],
  //     isCwic: false,
  //     location: { search: 'value' },
  //     onExcludeGranule: jest.fn(),
  //     onFocusedGranuleChange: jest.fn(),
  //     onMetricsDataAccess: jest.fn(),
  //     itemCount: 2,
  //     isItemLoaded: jest.fn(),
  //     loadMoreItems: jest.fn(),
  //     setVisibleMiddleIndex: jest.fn(),
  //     visibleMiddleIndex: 1
  //   }
  // }

  // if (type === 'loadingMore') {
  //   props = {
  //     collectionId: 'collectionId',
  //     excludedGranuleIds: [],
  //     focusedGranule: '',
  //     granules: [],
  //     isCwic: false,
  //     location: { search: 'value' },
  //     onExcludeGranule: jest.fn(),
  //     onFocusedGranuleChange: jest.fn(),
  //     onMetricsDataAccess: jest.fn(),
  //     itemCount: 1,
  //     isItemLoaded: jest.fn(),
  //     loadMoreItems: jest.fn(),
  //     setVisibleMiddleIndex: jest.fn(),
  //     visibleMiddleIndex: 1
  //   }
  // }

  if (type === 'loaded') {
    props = {
      collectionId: 'collectionId',
      excludedGranuleIds: [],
      focusedGranule: '',
      granules: [
        {
          title: '123'
        },
        {
          title: '456'
        }
      ],
      isCwic: false,
      location: { search: 'value' },
      onExcludeGranule: jest.fn(),
      onFocusedGranuleChange: jest.fn(),
      onMetricsDataAccess: jest.fn(),
      itemCount: 2,
      isItemLoaded: jest.fn(),
      loadMoreItems: jest.fn(),
      setVisibleMiddleIndex: jest.fn(),
      visibleMiddleIndex: 1
    }
  }
  // }

  // if (type === 'excludedCmr') {
  //   props = {
  //     collectionId: 'collectionId',
  //     excludedGranuleIds: ['G12345-PROV'],
  //     focusedGranule: '',
  //     granules: [
  //       {
  //         title: 'G12345-PROV'
  //       },
  //       {
  //         title: 'G56789-PROV'
  //       }
  //     ],
  //     isCwic: false,
  //     location: { search: 'value' },
  //     onExcludeGranule: jest.fn(),
  //     onFocusedGranuleChange: jest.fn(),
  //     onMetricsDataAccess: jest.fn(),
  //     itemCount: 2,
  //     isItemLoaded: jest.fn(),
  //     loadMoreItems: jest.fn(),
  //     setVisibleMiddleIndex: jest.fn(),
  //     visibleMiddleIndex: 1
  //   }
  // }

  // if (type === 'excludedCwic') {
  //   props = {
  //     collectionId: 'collectionId',
  //     excludedGranuleIds: ['329585043'],
  //     focusedGranule: '',
  //     granules: [
  //       {
  //         title: '12345 Granule'
  //       },
  //       {
  //         title: '56789 Granule'
  //       }
  //     ],
  //     isCwic: true,
  //     location: { search: 'value' },
  //     onExcludeGranule: jest.fn(),
  //     onFocusedGranuleChange: jest.fn(),
  //     onMetricsDataAccess: jest.fn(),
  //     itemCount: 2,
  //     isItemLoaded: jest.fn(),
  //     loadMoreItems: jest.fn(),
  //     setVisibleMiddleIndex: jest.fn(),
  //     visibleMiddleIndex: 1
  //   }
  // }

  const enzymeWrapper = mount(<GranuleResultsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup('loaded')

    expect(enzymeWrapper.exists()).toEqual(true)
    expect(enzymeWrapper.childAt(0).props().className).toBe('granule-results-list')
  })

  test('renders the AutoSizer', () => {
    const { enzymeWrapper } = setup('loaded')

    expect(enzymeWrapper.find(AutoSizer).length).toEqual(1)
  })

  describe('GranuleResultsListBody', () => {
    test('renders the GranuleResultsListBody', () => {
      const { enzymeWrapper } = setup('loaded')

      expect(enzymeWrapper.find(GranuleResultsListBody).length).toEqual(1)
    })

    test('recieves the correct height and width props', () => {
      const { enzymeWrapper } = setup('loaded')

      expect(enzymeWrapper.find(GranuleResultsListBody).prop('height')).toEqual(500)
      expect(enzymeWrapper.find(GranuleResultsListBody).prop('width')).toEqual(800)
    })
  })
})
