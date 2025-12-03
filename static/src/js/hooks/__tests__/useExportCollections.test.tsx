import React from 'react'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../jestConfigs/setupTest'

import { useExportCollections } from '../useExportCollections'
import EXPORT_COLLECTIONS from '../../operations/queries/exportCollections'

// @ts-expect-error There are no types for this file
import { constructDownloadableFile } from '../../util/files/constructDownloadableFile'

jest.mock('../../util/files/constructDownloadableFile', () => ({
  constructDownloadableFile: jest.fn()
}))

const TestComponent = () => {
  const {
    exportCollections,
    exportFormat,
    exportLoading
  } = useExportCollections()

  return (
    <div>
      <span>
        Export Format:
        {' '}
        {exportFormat}
      </span>

      <span>
        Loading:
        {' '}
        {exportLoading.toString()}
      </span>

      <button
        type="button"
        onClick={() => exportCollections('csv')}
      >
        Export CSV
      </button>

      <button
        type="button"
        onClick={() => exportCollections('json')}
      >
        Export JSON
      </button>
    </div>
  )
}

const collections = {
  cursor: 'mock-cursor',
  count: 3,
  items: [
    {
      provider: 'LAADS',
      shortName: 'VNP03IMG',
      version: '2',
      title: 'VIIRS/NPP Imagery Resolution Terrain Corrected Geolocation 6-Min L1 Swath 375 m',
      processingLevel: {
        id: '1A'
      },
      platforms: [
        {
          instruments: [
            {
              shortName: 'VIIRS',
              longName: 'Visible-Infrared Imager-Radiometer Suite'
            }
          ],
          type: 'Earth Observation Satellites',
          shortName: 'Suomi-NPP',
          longName: 'Suomi National Polar-orbiting Partnership'
        }
      ],
      timeStart: '2012-01-19T00:00:00.000Z',
      timeEnd: null
    },
    {
      provider: 'LANCEMODIS',
      shortName: 'VNP03IMG_NRT',
      version: '2',
      title: 'VIIRS/NPP Imagery Resolution Terrain-Corrected Geolocation 6-Min L1 Swath 375m NRT',
      processingLevel: {
        id: '1B'
      },
      platforms: [
        {
          instruments: [
            {
              shortName: 'VIIRS',
              longName: 'Visible-Infrared Imager-Radiometer Suite'
            }
          ],
          type: 'Earth Observation Satellites',
          shortName: 'Suomi-NPP',
          longName: 'Suomi National Polar-orbiting Partnership'
        }
      ],
      timeStart: '2021-12-15T00:00:00.000Z',
      timeEnd: null
    },
    {
      provider: 'LANCEMODIS',
      shortName: 'VJ103IMG_NRT',
      version: '2.1',
      title: 'VIIRS/JPSS1 Imagery Resolution Terrain Corrected Geolocation 6 Min L1 Swath 375m NRT',
      processingLevel: {
        id: '1B'
      },
      platforms: [
        {
          instruments: [
            {
              shortName: 'VIIRS',
              longName: 'Visible-Infrared Imager-Radiometer Suite'
            }
          ],
          type: 'Earth Observation Satellites',
          shortName: 'NOAA-20',
          longName: 'Joint Polar Satellite System - 1'
        }
      ],
      timeStart: '2022-01-01T00:00:00.000Z',
      timeEnd: null
    }
  ]
}

const setup = setupTest({
  Component: TestComponent,
  defaultApolloClientMocks: [{
    request: {
      query: EXPORT_COLLECTIONS,
      variables: {
        params: {
          includeHasGranules: true,
          options: {},
          sortKey: [
            'has_granules_or_cwic',
            '-usage_score',
            '-create-data-date'
          ],
          consortium: [],
          hasGranulesOrCwic: true,
          keyword: 'VNP03IMG*',
          serviceType: [],
          tagKey: [],
          limit: 1000
        }
      }
    },
    result: {
      data: {
        collections
      }
    }
  }, {
    request: {
      query: EXPORT_COLLECTIONS,
      variables: {
        params: {
          includeHasGranules: true,
          options: {},
          sortKey: [
            'has_granules_or_cwic',
            '-usage_score',
            '-create-data-date'
          ],
          consortium: [],
          cursor: 'mock-cursor',
          hasGranulesOrCwic: true,
          keyword: 'VNP03IMG*',
          serviceType: [],
          tagKey: [],
          limit: 1000
        }
      }
    },
    result: {
      data: {
        collections: {
          cursor: null,
          count: 621,
          items: []
        }
      }
    }
  }],
  defaultZustandState: {
    query: {
      collection: {
        byId: {},
        hasGranulesOrCwic: true,
        keyword: 'VNP03IMG',
        onlyEosdisCollections: false,
        overrideTemporal: {},
        pageNum: 1,
        sortKey: '-usage_score',
        spatial: {},
        tagKey: '',
        temporal: {}
      }
    }
  },
  withApolloClient: true,
  withRouter: true
})

describe('useExportCollections', () => {
  describe('when exporting CSV', () => {
    test('downloads a CSV file', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { name: 'Export CSV' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Loading: true')).toBeInTheDocument()
      })

      expect(screen.getByText('Export Format: csv')).toBeInTheDocument()

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
      expect(constructDownloadableFile).toHaveBeenCalledWith(
        'Data Provider,Short Name,Version,Entry Title,Processing Level,Platform,Start Time,End Time\r\n"LAADS","VNP03IMG","2","VIIRS/NPP Imagery Resolution Terrain Corrected Geolocation 6-Min L1 Swath 375 m","1A","Suomi-NPP","2012-01-19T00:00:00.000Z",\r\n"LANCEMODIS","VNP03IMG_NRT","2","VIIRS/NPP Imagery Resolution Terrain-Corrected Geolocation 6-Min L1 Swath 375m NRT","1B","Suomi-NPP","2021-12-15T00:00:00.000Z",\r\n"LANCEMODIS","VJ103IMG_NRT","2.1","VIIRS/JPSS1 Imagery Resolution Terrain Corrected Geolocation 6 Min L1 Swath 375m NRT","1B","NOAA-20","2022-01-01T00:00:00.000Z",\r\n',
        'edsc_collection_results_export.csv',
        'text/csv'
      )

      expect(screen.getByText('Loading: false')).toBeInTheDocument()
    })
  })

  describe('when exporting JSON', () => {
    test('downloads a JSON file', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { name: 'Export JSON' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Loading: true')).toBeInTheDocument()
      })

      expect(screen.getByText('Export Format: json')).toBeInTheDocument()

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
      expect(constructDownloadableFile).toHaveBeenCalledWith(
        JSON.stringify([{
          provider: 'LAADS',
          shortName: 'VNP03IMG',
          version: '2',
          title: 'VIIRS/NPP Imagery Resolution Terrain Corrected Geolocation 6-Min L1 Swath 375 m',
          processingLevel: { id: '1A' },
          platforms: [{
            instruments: [{
              shortName: 'VIIRS',
              longName: 'Visible-Infrared Imager-Radiometer Suite'
            }],
            type: 'Earth Observation Satellites',
            shortName: 'Suomi-NPP',
            longName: 'Suomi National Polar-orbiting Partnership'
          }],
          timeStart: '2012-01-19T00:00:00.000Z',
          timeEnd: null
        }, {
          provider: 'LANCEMODIS',
          shortName: 'VNP03IMG_NRT',
          version: '2',
          title: 'VIIRS/NPP Imagery Resolution Terrain-Corrected Geolocation 6-Min L1 Swath 375m NRT',
          processingLevel: { id: '1B' },
          platforms: [{
            instruments: [{
              shortName: 'VIIRS',
              longName: 'Visible-Infrared Imager-Radiometer Suite'
            }],
            type: 'Earth Observation Satellites',
            shortName: 'Suomi-NPP',
            longName: 'Suomi National Polar-orbiting Partnership'
          }],
          timeStart: '2021-12-15T00:00:00.000Z',
          timeEnd: null
        }, {
          provider: 'LANCEMODIS',
          shortName: 'VJ103IMG_NRT',
          version: '2.1',
          title: 'VIIRS/JPSS1 Imagery Resolution Terrain Corrected Geolocation 6 Min L1 Swath 375m NRT',
          processingLevel: { id: '1B' },
          platforms: [{
            instruments: [{
              shortName: 'VIIRS',
              longName: 'Visible-Infrared Imager-Radiometer Suite'
            }],
            type: 'Earth Observation Satellites',
            shortName: 'NOAA-20',
            longName: 'Joint Polar Satellite System - 1'
          }],
          timeStart: '2022-01-01T00:00:00.000Z',
          timeEnd: null
        }]),
        'edsc_collection_results_export.json',
        'application/json'
      )

      expect(screen.getByText('Loading: false')).toBeInTheDocument()
    })
  })

  describe('when there is an error', () => {
    test('calls handleError', async () => {
      const { user, zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: EXPORT_COLLECTIONS,
            variables: {
              params: {
                includeHasGranules: true,
                options: {},
                sortKey: [
                  'has_granules_or_cwic',
                  '-usage_score',
                  '-create-data-date'
                ],
                consortium: [],
                hasGranulesOrCwic: true,
                keyword: 'VNP03IMG*',
                serviceType: [],
                tagKey: [],
                limit: 1000
              }
            }
          },
          error: new Error('An error occurred')
        }],
        overrideZustandState: {
          errors: {
            handleError: jest.fn()
          }
        }
      })

      const button = screen.getByRole('button', { name: 'Export JSON' })
      await user.click(button)

      // Wait for the error to be handled
      await waitFor(() => {
        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        error: new Error('An error occurred'),
        action: 'exportSearch',
        resource: 'collections',
        showAlertButton: true,
        title: 'Something went wrong exporting your search'
      })
    })
  })
})
