import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CollectionResultsList from '../CollectionResultsList'
import CollectionResultsItem from '../CollectionResultsItem'

// TODO: Write more tests

Enzyme.configure({ adapter: new Adapter() })

function setup(propsOverride = {}) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collections: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          id: 'collectionId1'
        },
        collectionId2: {
          id: 'collectionId2'
        }
      },
      hits: '181',
      isLoaded: true,
      isLoading: false,
      loadTime: 1150,
      timerStart: null
    },
    portal: {
      portalId: ''
    },
    projectIds: [],
    location: {
      pathname: '/test'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    waypointEnter: jest.fn(),
    scrollContainer: (() => {
      const el = document.createElement('div')
      el.classList.add('simplebar-content-wrapper')
      return el
    })(),
    ...propsOverride
  }

  const enzymeWrapper = shallow(<CollectionResultsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toEqual('ul')
    expect(enzymeWrapper.props().className).toEqual('collection-results-list')
  })

  test('renders its list correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(CollectionResultsItem).length).toEqual(2)
  })

  test('sets the is last prop on the last list item', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(CollectionResultsItem).at(1).props().isLast).toEqual(true)
  })

  test('should pass the scrollContainer to the items', () => {
    const { enzymeWrapper, props } = setup({
      isLast: true
    })

    expect(enzymeWrapper.find(CollectionResultsItem).at(1).prop('scrollContainer'))
      .toEqual(props.scrollContainer)
  })

  describe('loading list item', () => {
    test('shows on first load', () => {
      const { enzymeWrapper } = setup({
        collections: {
          allIds: [],
          byId: {},
          hits: null,
          isLoaded: false,
          isLoading: true,
          loadTime: 0,
          timerStart: null
        }
      })

      expect(enzymeWrapper.find('.collection-results-list__loading').length).toEqual(1)
    })

    test('shows when additional items are being loaded', () => {
      const { enzymeWrapper } = setup({
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              id: 'collectionId1'
            },
            collectionId2: {
              id: 'collectionId2'
            }
          },
          hits: '181',
          isLoaded: true,
          isLoading: true,
          loadTime: 1150,
          timerStart: null
        }
      })

      expect(enzymeWrapper.find(CollectionResultsItem).length).toEqual(2)
      expect(enzymeWrapper.find('.collection-results-list__loading').length).toEqual(1)
    })

    test('does not show the loading item when items are loaded', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.collection-results-list__loading').length).toEqual(0)
    })
  })
})
