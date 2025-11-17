import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminRetrievalsMetricsList from '../AdminRetrievalsMetricsList'

const mockRetrievalsMetrics = {
  adminRetrievalsMetrics: {
    retrievalResponse: [
      {
        accessMethodType: 'Harmony',
        totalTimesAccessMethodUsed: 'Total Times Access Method Used HARMONY 1',
        averageGranuleCount: 'average granule count HARMONY 2',
        averageGranuleLinkCount: 'average granule link count HARMONY 3',
        totalGranulesRetrieved: 'total Granules Retrieved HARMONY 4',
        maxGranuleLinkCount: 1,
        minGranuleLinkCount: 50
      },
      {
        accessMethodType: 'download',
        totalTimesAccessMethodUsed: 'Total Times Access Method Used DOWNLOAD 1',
        averageGranuleCount: 'average granule count DOWNLOAD 2',
        averageGranuleLinkCount: 'average granule link count DOWNLOAD 3',
        totalGranulesRetrieved: 'total Granules Retrieved DOWNLOAD 4',
        maxGranuleLinkCount: 240,
        minGranuleLinkCount: 160
      }
    ],
    multCollectionResponse: [
      {
        collectionCount: 2,
        retrievalId: 6
      }
    ]
  }
}

const setup = setupTest({
  Component: AdminRetrievalsMetricsList,
  defaultProps: {
    retrievalsMetrics: mockRetrievalsMetrics
  }
})

describe('AdminRetrievalsList component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getAllByRole('columnheader').length).toEqual(9)

    // Retrieval metrics table
    expect(screen.getByRole('columnheader', { name: 'Data Access Type' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Total Times Access Method Used' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Average Granule Count' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Total Granules Retrieved' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Average Granule Link Count' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Max Granule Link Count' }))
      .toBeInTheDocument()

    // Retrieval use table
    expect(screen.getByRole('columnheader', { name: 'Minimum Granule Link Count' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Retrieval-id for retrievals that included multiple collections' }))
      .toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Number of collections in the retrieval' }))
  })

  test('renders the collections table when collections are provided', () => {
    setup()

    // Check for Harmony row
    expect(screen.getByText('Harmony')).toBeInTheDocument()
    expect(screen.getByText('Total Times Access Method Used HARMONY 1')).toBeInTheDocument()
    expect(screen.getByText('average granule count HARMONY 2')).toBeInTheDocument()
    expect(screen.getByText('total Granules Retrieved HARMONY 4')).toBeInTheDocument()
    expect(screen.getByText('average granule link count HARMONY 3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()

    // Check for download row
    expect(screen.getByText('download')).toBeInTheDocument()
    expect(screen.getByText('Total Times Access Method Used DOWNLOAD 1')).toBeInTheDocument()
    expect(screen.getByText('average granule count DOWNLOAD 2')).toBeInTheDocument()
    expect(screen.getByText('total Granules Retrieved DOWNLOAD 4')).toBeInTheDocument()
    expect(screen.getByText('average granule link count DOWNLOAD 3')).toBeInTheDocument()
    expect(screen.getByText('240')).toBeInTheDocument()
    expect(screen.getByText('160')).toBeInTheDocument()

    // Check for multiple collections table
    expect(screen.getByText('Retrieval-id for retrievals that included multiple collections')).toBeInTheDocument()
    expect(screen.getByText('Number of collections in the retrieval')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
