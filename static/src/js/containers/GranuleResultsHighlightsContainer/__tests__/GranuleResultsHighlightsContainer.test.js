import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { GranuleResultsHighlightsContainer, mapStateToProps } from '../GranuleResultsHighlightsContainer'
import GranuleResultsHighlights from '../../../components/GranuleResultsHighlights/GranuleResultsHighlights'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionsQuery: {},
    focusedCollectionGranuleSearch: {
      allIds: ['id1'],
      hits: 1,
      isLoaded: true,
      isLoading: false,
      byId: {
        focusedCollection: {
          granules: {
            allIds: ['id1'],
            hits: 1,
            isLoaded: true,
            isLoading: false
          }
        }
      }
    },
    focusedCollectionId: 'focusedCollection',
    focusedCollectionGranuleMetadata: {
      id1: {
        mock: 'data'
      }
    },
    focusedCollectionMetadata: {},
    location: {
      search: ''
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsHighlightsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {}
      },
      searchResults: {
        collections: {}
      }
    }

    const expectedState = {
      collectionsQuery: {},
      focusedCollectionGranuleSearch: {},
      focusedCollectionGranuleMetadata: {},
      focusedCollectionId: 'collectionId',
      focusedCollectionMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsHighlightsContainer component', () => {
  test('passes its props and renders a single GranuleResultsHighlights component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsHighlights).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().granules).toEqual([{
      mock: 'data'
    }])
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().granuleCount).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().visibleGranules).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().location).toEqual({ search: '' })
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().isLoading).toEqual(false)
    expect(enzymeWrapper.find(GranuleResultsHighlights).props().isLoaded).toEqual(true)
  })
})
