import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import CollectionResultsTable from '../CollectionResultsTable'
import EDSCTable from '../../EDSCTable/EDSCTable'
import { collectionData } from './mocks'

vi.mock('../../EDSCTable/EDSCTable', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: CollectionResultsTable,
  defaultProps: {
    collectionsMetadata: collectionData,
    isItemLoaded: vi.fn(),
    itemCount: 1,
    loadMoreItems: vi.fn(),
    setVisibleMiddleIndex: vi.fn(),
    visibleMiddleIndex: 1
  }
})

describe('CollectionResultsTable component', () => {
  test('renders EDSCTable', () => {
    setup()

    expect(EDSCTable).toHaveBeenCalledTimes(1)
    expect(EDSCTable).toHaveBeenCalledWith({
      id: 'collection-results-table',
      rowTestId: 'collection-results-table__item',
      visibleMiddleIndex: 1,
      columns: [
        {
          Header: 'Collection',
          Cell: expect.any(Function),
          accessor: 'datasetId',
          sticky: 'left',
          width: '300',
          customProps: {
            cellClassName: 'collection-results-table__cell--collection',
            collectionId: '1234'
          }
        },
        {
          Header: 'Version',
          Cell: expect.any(Function),
          accessor: 'versionId',
          width: '100',
          customProps: { centerContent: true }
        },
        {
          Header: 'Start',
          Cell: expect.any(Function),
          accessor: 'temporalStart',
          width: '100',
          customProps: { centerContent: true }
        },
        {
          Header: 'End',
          Cell: expect.any(Function),
          accessor: 'temporalEnd',
          width: '100',
          customProps: { centerContent: true }
        },
        {
          Header: 'Granules',
          Cell: expect.any(Function),
          accessor: 'granuleCount',
          customProps: { centerContent: true }
        },
        {
          Header: 'Provider',
          Cell: expect.any(Function),
          accessor: 'displayOrganization',
          width: '150',
          customProps: { centerContent: true }
        },
        {
          Header: 'Short Name',
          Cell: expect.any(Function),
          accessor: 'shortName',
          width: '150',
          customProps: { centerContent: true }
        },
        {
          Header: expect.any(Function),
          Cell: expect.any(Function),
          accessor: 'cloudHosted',
          width: '130',
          customProps: { centerContent: true }
        },
        {
          Header: expect.any(Function),
          Cell: expect.any(Function),
          accessor: 'hasMapImagery',
          width: '110',
          customProps: { centerContent: true }
        },
        {
          Header: expect.any(Function),
          Cell: expect.any(Function),
          accessor: 'isNrt',
          width: '120',
          customProps: { centerContent: true }
        },
        {
          Header: 'Spatial Subsetting',
          Cell: expect.any(Function),
          accessor: 'hasSpatialSubsetting',
          width: '130',
          customProps: { centerContent: true }
        },
        {
          Header: 'Temporal Subsetting',
          Cell: expect.any(Function),
          accessor: 'hasTemporalSubsetting',
          width: '140',
          customProps: { centerContent: true }
        },
        {
          Header: 'Variable Subsetting',
          Cell: expect.any(Function),
          accessor: 'hasVariables',
          width: '130',
          customProps: { centerContent: true }
        },
        {
          Header: 'Transformation',
          Cell: expect.any(Function),
          accessor: 'hasTransforms',
          width: '120',
          customProps: { centerContent: true }
        },
        {
          Header: 'Reformatting',
          Cell: expect.any(Function),
          accessor: 'hasFormats',
          width: '120',
          customProps: { centerContent: true }
        },
        {
          Header: 'Combine',
          Cell: expect.any(Function),
          accessor: 'hasCombine',
          width: '120',
          customProps: { centerContent: true }
        }
      ],
      data: collectionData,
      itemCount: 1,
      loadMoreItems: expect.any(Function),
      isItemLoaded: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      striped: true
    }, {})
  })
})
