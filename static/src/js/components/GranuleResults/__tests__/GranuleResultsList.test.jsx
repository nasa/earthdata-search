import React from 'react'

import GranuleResultsList from '../GranuleResultsList'
import GranuleResultsListBody from '../GranuleResultsListBody'

import setupTest from '../../../../../../vitestConfigs/setupTest'

vi.mock('../GranuleResultsListBody', () => ({ default: vi.fn(() => <div />) }))

// Mock AutoSizer to return a fixed height and width (jsdom doesn't have sizes)
vi.mock('react-virtualized-auto-sizer', () => ({
  default: ({ children }) => children({
    height: 600,
    width: 600
  })
}))

const setup = setupTest({
  Component: GranuleResultsList,
  defaultProps: {
    collectionId: 'collectionId',
    directDistributionInformation: {},
    excludedGranuleIds: [],
    granules: [
      {
        title: '123'
      },
      {
        title: '456'
      }
    ],
    isOpenSearch: false,
    isCollectionInProject: true,
    isGranuleInProject: vi.fn(),
    isProjectGranulesLoading: false,
    itemCount: 2,
    isItemLoaded: vi.fn().mockReturnValue(true),
    loadMoreItems: vi.fn(),
    readableGranuleName: [''],
    setVisibleMiddleIndex: vi.fn(),
    visibleMiddleIndex: 1
  }
})

describe('GranuleResultsList component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(GranuleResultsListBody).toHaveBeenCalledTimes(1)
    expect(GranuleResultsListBody).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      directDistributionInformation: {},
      excludedGranuleIds: [],
      granules: [{ title: '123' }, { title: '456' }],
      height: 600,
      isCollectionInProject: true,
      isGranuleInProject: expect.any(Function),
      isItemLoaded: expect.any(Function),
      isOpenSearch: false,
      itemCount: 2,
      loadMoreItems: expect.any(Function),
      readableGranuleName: [''],
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: 1,
      width: 600
    }, {})
  })
})
