import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import {
  GranuleResultsHighlightsContainer,
  mapStateToProps
} from '../GranuleResultsHighlightsContainer'
import GranuleResultsHighlights from '../../../components/GranuleResultsHighlights/GranuleResultsHighlights'

jest.mock('../../../components/GranuleResultsHighlights/GranuleResultsHighlights', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsHighlightsContainer,
  defaultProps: {
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
    focusedCollectionMetadata: {}
  }
})

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
    setup()

    expect(GranuleResultsHighlights).toHaveBeenCalledTimes(1)
    expect(GranuleResultsHighlights).toHaveBeenCalledWith({
      granuleCount: 1,
      granules: [{ mock: 'data' }],
      isLoaded: true,
      isLoading: false,
      visibleGranules: 1
    }, {})
  })
})
