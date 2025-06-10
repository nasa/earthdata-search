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
    collectionQuerySpatial: {},
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
    onAddGranuleToProjectCollection: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onGenerateNotebook: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
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
  })
})
