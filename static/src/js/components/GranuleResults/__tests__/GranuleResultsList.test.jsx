import React from 'react'

import GranuleResultsList from '../GranuleResultsList'
import GranuleResultsListBody from '../GranuleResultsListBody'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../GranuleResultsListBody', () => jest.fn(() => <div />))

// Mock AutoSizer to return a fixed height and width (jsdom doesn't have sizes)
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({
  height: 600,
  width: 600
}))

const setup = setupTest({
  Component: GranuleResultsList,
  defaultProps: {
    collectionId: 'collectionId',
    collectionTags: {},
    directDistributionInformation: {},
    excludedGranuleIds: [],
    focusedGranuleId: '',
    generateNotebook: {},
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
    isGranuleInProject: jest.fn(),
    isProjectGranulesLoading: false,
    location: { search: 'value' },
    onFocusedGranuleChange: jest.fn(),
    onGenerateNotebook: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onMetricsAddGranuleProject: jest.fn(),
    itemCount: 2,
    isItemLoaded: jest.fn().mockReturnValue(true),
    loadMoreItems: jest.fn(),
    readableGranuleName: [''],
    setVisibleMiddleIndex: jest.fn(),
    visibleMiddleIndex: 1
  }
})

describe('GranuleResultsList component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(GranuleResultsListBody).toHaveBeenCalledTimes(1)
    expect(GranuleResultsListBody).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      collectionTags: {},
      directDistributionInformation: {},
      excludedGranuleIds: [],
      focusedGranuleId: '',
      generateNotebook: {},
      granules: [{ title: '123' }, { title: '456' }],
      height: 600,
      isCollectionInProject: true,
      isGranuleInProject: expect.any(Function),
      isItemLoaded: expect.any(Function),
      isOpenSearch: false,
      itemCount: 2,
      loadMoreItems: expect.any(Function),
      location: { search: 'value' },
      onFocusedGranuleChange: expect.any(Function),
      onGenerateNotebook: expect.any(Function),
      onMetricsAddGranuleProject: expect.any(Function),
      onMetricsDataAccess: expect.any(Function),
      readableGranuleName: [''],
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: 1,
      width: 600
    }, {})
  })
})
