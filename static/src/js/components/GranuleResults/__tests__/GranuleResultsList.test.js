import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'


import { GranuleResultsList } from '../GranuleResultsList'
import GranuleResultsItem from '../GranuleResultsItem'
import Skeleton from '../../Skeleton/Skeleton'

Enzyme.configure({ adapter: new Adapter() })

function setup(type) {
  let props

  if (type === 'loading') {
    props = {
      collectionId: 'collectionId',
      excludedGranuleIds: [],
      focusedGranule: '',
      granules: {
        hits: null,
        loadTime: null,
        isLoading: true,
        isLoaded: false,
        allIds: [],
        byId: {}
      },
      isCwic: false,
      pageNum: 1,
      location: { search: 'value' },
      waypointEnter: jest.fn(),
      scrollContainer: (() => {
        const el = document.createElement('div')
        el.classList.add('simplebar-content-wrapper')
        return el
      })(),
      onExcludeGranule: jest.fn(),
      onFocusedGranuleChange: jest.fn(),
      onMetricsDataAccess: jest.fn()
    }
  }

  if (type === 'loadingMore') {
    props = {
      collectionId: 'collectionId',
      excludedGranuleIds: [],
      focusedGranule: '',
      granules: {
        hits: null,
        loadTime: null,
        isLoading: true,
        isLoaded: false,
        allIds: [],
        byId: {}
      },
      isCwic: false,
      pageNum: 2,
      location: { search: 'value' },
      waypointEnter: jest.fn(),
      scrollContainer: (() => {
        const el = document.createElement('div')
        el.classList.add('simplebar-content-wrapper')
        return el
      })(),
      onExcludeGranule: jest.fn(),
      onFocusedGranuleChange: jest.fn(),
      onMetricsDataAccess: jest.fn()
    }
  }

  if (type === 'loaded') {
    props = {
      collectionId: 'collectionId',
      excludedGranuleIds: [],
      focusedGranule: '',
      granules: {
        hits: 23,
        loadTime: 1524,
        isLoading: false,
        isLoaded: true,
        allIds: [
          123,
          456
        ],
        byId: {
          123: {
            title: '123'
          },
          456: {
            title: '456'
          }
        }
      },
      isCwic: false,
      pageNum: 1,
      location: { search: 'value' },
      waypointEnter: jest.fn(),
      scrollContainer: (() => {
        const el = document.createElement('div')
        el.classList.add('simplebar-content-wrapper')
        return el
      })(),
      onExcludeGranule: jest.fn(),
      onFocusedGranuleChange: jest.fn(),
      onMetricsDataAccess: jest.fn()
    }
  }

  if (type === 'excludedCmr') {
    props = {
      collectionId: 'collectionId',
      excludedGranuleIds: ['G12345-PROV'],
      focusedGranule: '',
      granules: {
        hits: 23,
        loadTime: 1524,
        isLoading: false,
        isLoaded: true,
        allIds: ['G12345-PROV', 'G56789-PROV'],
        byId: {
          'G12345-PROV': {
            title: 'G12345-PROV'
          },
          'G56789-PROV': {
            title: 'G56789-PROV'
          }
        }
      },
      isCwic: false,
      pageNum: 1,
      location: { search: 'value' },
      waypointEnter: jest.fn(),
      scrollContainer: (() => {
        const el = document.createElement('div')
        el.classList.add('simplebar-content-wrapper')
        return el
      })(),
      onExcludeGranule: jest.fn(),
      onFocusedGranuleChange: jest.fn(),
      onMetricsDataAccess: jest.fn()
    }
  }

  if (type === 'excludedCwic') {
    props = {
      collectionId: 'collectionId',
      excludedGranuleIds: ['329585043'],
      focusedGranule: '',
      granules: {
        hits: 23,
        loadTime: 1524,
        isLoading: false,
        isLoaded: true,
        allIds: ['12345', '56789'],
        byId: {
          12345: {
            title: '12345 Granule'
          },
          56789: {
            title: '56789 Granule'
          }
        }
      },
      isCwic: true,
      pageNum: 1,
      location: { search: 'value' },
      waypointEnter: jest.fn(),
      scrollContainer: (() => {
        const el = document.createElement('div')
        el.classList.add('simplebar-content-wrapper')
        return el
      })(),
      onExcludeGranule: jest.fn(),
      onFocusedGranuleChange: jest.fn(),
      onMetricsDataAccess: jest.fn()
    }
  }

  const enzymeWrapper = shallow(<GranuleResultsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup('loading')

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-results-list')
  })

  test('should pass the scrollContainer to the items', () => {
    const { enzymeWrapper, props } = setup('loaded')

    expect(enzymeWrapper.find(GranuleResultsItem).at(1).prop('scrollContainer'))
      .toEqual(props.scrollContainer)
  })

  describe('while loading more pages', () => {
    test('renders the correct Skeleton elements', () => {
      const { enzymeWrapper } = setup('loadingMore')

      expect(enzymeWrapper.find('.granule-results-list__list').find(Skeleton).length).toEqual(1)
    })
  })

  describe('when loaded', () => {
    test('renders the correct GranuleResultsItem components', () => {
      const { enzymeWrapper } = setup('loaded')

      expect(enzymeWrapper.find(GranuleResultsItem).length).toEqual(2)
    })

    test('removes CMR excludedGranules from the list', () => {
      const { enzymeWrapper } = setup('excludedCmr')

      expect(enzymeWrapper.find(GranuleResultsItem).length).toEqual(1)
      expect(enzymeWrapper.find(GranuleResultsItem).props().granule).toEqual({ title: 'G56789-PROV' })
    })

    test('removes CWIC excludedGranules from the list', () => {
      const { enzymeWrapper } = setup('excludedCwic')

      expect(enzymeWrapper.find(GranuleResultsItem).length).toEqual(1)
      expect(enzymeWrapper.find(GranuleResultsItem).props().granule).toEqual({ title: '56789 Granule' })
    })
  })
})
