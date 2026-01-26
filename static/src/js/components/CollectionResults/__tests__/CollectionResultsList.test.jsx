import React from 'react'
import { waitFor } from '@testing-library/react'

import CollectionResultsList from '../CollectionResultsList'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import CollectionResultsListItem from '../CollectionResultsListItem'

// Mock React.memo, which is wrapping the CollectionResultsListItem. This allows us to mock
// the component.
vi.mock('react', async () => (
  {
    ...(await vi.importActual('react')),
    memo: (fn) => fn
  }
))

// Mock the CollectionResultsListItem component to allow us to test props passed to it
vi.mock('../CollectionResultsListItem', () => ({
  default: vi.fn(() => <div />)
}))

// Mock AutoSizer to return a fixed height and width (jsdom doesn't have sizes)
vi.mock('react-virtualized-auto-sizer', () => ({
  default: ({ children }) => children({
    height: 600,
    width: 600
  })
}))

// Mock PortalFeatureContainer to return its children so we don't have to mock the store
vi.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => ({
  default: vi.fn(({ children }) => <div>{children}</div>)
}))

const setup = setupTest({
  Component: CollectionResultsList,
  defaultProps: {
    collectionsMetadata: [{
      datasetId: 'Collection Title 1',
      collectionId: 'collectionId1'
    }, {
      datasetId: 'Collection Title 2',
      collectionId: 'collectionId2'
    }],
    itemCount: 2,
    isItemLoaded: vi.fn().mockReturnValue(true),
    loadMoreItems: vi.fn(),
    setVisibleMiddleIndex: vi.fn(),
    visibleMiddleIndex: 1
  }
})

describe('CollectionResultsList component', () => {
  test('renders its list correctly', async () => {
    setup()

    await waitFor(() => {
      // We only have 2 collections results, but `listRef.current.resetAfterIndex` causes
      // more renders as items are being rendered
      expect(CollectionResultsListItem).toHaveBeenCalledTimes(2)
    })

    expect(CollectionResultsListItem).toHaveBeenNthCalledWith(1, {
      data: {
        collectionsMetadata: [{
          collectionId: 'collectionId1',
          datasetId: 'Collection Title 1'
        }, {
          collectionId: 'collectionId2',
          datasetId: 'Collection Title 2'
        }],
        isItemLoaded: expect.any(Function),
        setSize: expect.any(Function),
        windowHeight: 600,
        windowWidth: 600
      },
      index: 0,
      isScrolling: undefined,
      style: {
        height: 162,
        left: 0,
        position: 'absolute',
        right: undefined,
        top: 0,
        width: '100%'
      }
    }, {})

    expect(CollectionResultsListItem).toHaveBeenNthCalledWith(2, {
      data: {
        collectionsMetadata: [{
          collectionId: 'collectionId1',
          datasetId: 'Collection Title 1'
        }, {
          collectionId: 'collectionId2',
          datasetId: 'Collection Title 2'
        }],
        isItemLoaded: expect.any(Function),
        setSize: expect.any(Function),
        windowHeight: 600,
        windowWidth: 600
      },
      index: 1,
      isScrolling: undefined,
      style: {
        height: 162,
        left: 0,
        position: 'absolute',
        right: undefined,
        top: 162,
        width: '100%'
      }
    }, {})
  })
})
