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
      granules: {
        hits: null,
        loadTime: null,
        isLoading: true,
        isLoaded: false,
        allIds: [],
        byId: {}
      },
      pageNum: 1,
      waypointEnter: jest.fn()
    }
  }

  if (type === 'loadingMore') {
    props = {
      granules: {
        hits: null,
        loadTime: null,
        isLoading: true,
        isLoaded: false,
        allIds: [],
        byId: {}
      },
      pageNum: 2,
      waypointEnter: jest.fn()
    }
  }

  if (type === 'loaded') {
    props = {
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
      pageNum: 1,
      waypointEnter: jest.fn()
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

  describe('while loading', () => {
    test('renders the correct Skeleton elements', () => {
      const { enzymeWrapper } = setup('loading')

      expect(enzymeWrapper.find('.granule-results-list__header-item').at(0).find(Skeleton).length).toEqual(1)
      expect(enzymeWrapper.find('.granule-results-list__header-item').at(1).find(Skeleton).length).toEqual(1)
      expect(enzymeWrapper.find('.granule-results-list__list').find(Skeleton).length).toEqual(3)
    })
  })

  describe('while loading more pages', () => {
    test('renders the correct Skeleton elements', () => {
      const { enzymeWrapper } = setup('loadingMore')

      expect(enzymeWrapper.find('.granule-results-list__list').find(Skeleton).length).toEqual(1)
    })
  })

  describe('when loaded', () => {
    test('renders the correct visible granules and hits', () => {
      const { enzymeWrapper } = setup('loaded')

      expect(enzymeWrapper.find('.granule-results-list__header-item').at(0).text()).toEqual('Showing 2 of 23 matching granules')
    })

    test('renders the correct search time', () => {
      const { enzymeWrapper } = setup('loaded')

      expect(enzymeWrapper.find('.granule-results-list__header-item').at(1).text()).toEqual('Search Time: 1.5s')
    })

    test('renders the correct GranuleResultsItem components', () => {
      const { enzymeWrapper } = setup('loaded')

      expect(enzymeWrapper.find(GranuleResultsItem).length).toEqual(2)
    })
  })
})
