import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CollectionResultsList from '../CollectionResultsList'
import CollectionResultsItem from '../CollectionResultsItem'

Enzyme.configure({ adapter: new Adapter() })

function setup(propsOverride = {}) {
  const props = {
    collections: [{
      datasetId: 'Collection Titlte 1',
      collectionId: 'collectionId1'
    }, {
      datasetId: 'Collection Titlte 2',
      collectionId: 'collectionId2'
    }],
    isLoading: false,
    portal: {
      portalId: ''
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
        collections: [],
        isLoading: true
      })

      expect(enzymeWrapper.find('.collection-results-list__loading').length).toEqual(1)
    })

    test('shows when additional items are being loaded', () => {
      const { enzymeWrapper } = setup({
        collections: [{
          datasetId: 'Collection Titlte 3',
          collectionId: 'collectionId3'
        }, {
          datasetId: 'Collection Titlte 4',
          collectionId: 'collectionId4'
        }],
        isLoading: true
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
