import {
  screen,
  waitFor,
  within
} from '@testing-library/react'

import AdminPreferencesMetricsList from '../AdminPreferencesMetricsList'
import ADMIN_PREFERENCES_METRICS from '../../../operations/queries/adminPreferencesMetrics'

import setupTest from '../../../../../../vitestConfigs/setupTest'

const setup = setupTest({
  Component: AdminPreferencesMetricsList,
  withApolloClient: true,
  defaultApolloClientMocks: [
    {
      request: {
        query: ADMIN_PREFERENCES_METRICS
      },
      result: {
        data: {
          adminPreferencesMetrics: {
            baseLayer: [
              {
                count: '2',
                percentage: '66.7',
                value: 'blueMarble'
              },
              {
                count: '1',
                percentage: '33.3',
                value: 'trueColor'
              }
            ],
            collectionListView: [
              {
                value: 'default',
                percentage: '66.7',
                count: '2'
              },
              {
                value: 'list',
                percentage: '33.3',
                count: '1'
              }
            ],
            collectionSort: [
              {
                value: 'default',
                percentage: '66.7',
                count: '2'
              },
              {
                value: '-score',
                percentage: '33.3',
                count: '1'
              }
            ],
            granuleListView: [
              {
                count: '2',
                percentage: '66.7',
                value: 'default'
              },
              {
                count: '1',
                percentage: '33.3',
                value: 'list'
              }
            ],
            granuleSort: [
              {
                value: '-end_date',
                percentage: '33.3',
                count: '1'
              },
              {
                value: '-start_date',
                percentage: '33.3',
                count: '1'
              },
              {
                value: 'default',
                percentage: '33.3',
                count: '1'
              }
            ],
            latitude: [
              {
                value: '39.65176367593365',
                percentage: '66.7',
                count: '2'
              },
              {
                value: '42.65176367593365',
                percentage: '33.3',
                count: '1'
              }
            ],
            longitude: [
              {
                value: '-104.92001918508592',
                percentage: '66.7',
                count: '2'
              },
              {
                value: '-100.92001918508592',
                percentage: '33.3',
                count: '1'
              }
            ],
            overlayLayers: [
              {
                value: 'referenceFeatures',
                percentage: '66.7',
                count: '2'
              },
              {
                value: 'bordersRoads',
                percentage: '33.3',
                count: '1'
              }
            ],
            panelState: [
              {
                value: 'full_width',
                percentage: '33.3',
                count: '1'
              },
              {
                value: 'collapsed',
                percentage: '33.3',
                count: '1'
              },
              {
                value: 'default',
                percentage: '33.3',
                count: '1'
              }
            ],
            projection: [
              {
                value: 'epsg4326',
                percentage: '66.7',
                count: '2'
              },
              {
                value: 'epsg3413',
                percentage: '33.3',
                count: '1'
              }
            ],
            zoom: [
              {
                value: '7',
                percentage: '66.7',
                count: '2'
              },
              {
                value: '4',
                percentage: '33.3',
                count: '1'
              }
            ]
          }
        }
      }
    }
  ]
})

describe('AdminPreferencesMetricsList component', () => {
  test('renders itself correctly', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getAllByRole('table')).toHaveLength(11)
    })

    const tableHeadings = screen.getAllByRole('heading', { name: /^(?=.*Top)(?=.*Values).*/ })
    const tables = screen.getAllByRole('table')

    expect(screen.queryAllByLabelText('Preferences Metrics Spinner').length).toEqual(0)

    expect(tableHeadings).toHaveLength(11)
    expect(tables).toHaveLength(11)

    expect(tableHeadings[0]).toHaveTextContent('Top Base Layer Values')
    expect(within(tables[0]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[0]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[0]).getAllByRole('columnheader')[0]).toHaveTextContent('blueMarble')
    expect(within(tables[0]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[0]).getAllByRole('columnheader')[1]).toHaveTextContent('trueColor')
    expect(within(tables[0]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[1]).toHaveTextContent('Top Collection List View Values')
    expect(within(tables[1]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[1]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[1]).getAllByRole('columnheader')[0]).toHaveTextContent('default')
    expect(within(tables[1]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[1]).getAllByRole('columnheader')[1]).toHaveTextContent('list')
    expect(within(tables[1]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[2]).toHaveTextContent('Top Collection Sort Values')
    expect(within(tables[2]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[2]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[2]).getAllByRole('columnheader')[0]).toHaveTextContent('default')
    expect(within(tables[2]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[2]).getAllByRole('columnheader')[1]).toHaveTextContent('-score')
    expect(within(tables[2]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[3]).toHaveTextContent('Top Granule List View Values')
    expect(within(tables[3]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[3]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[3]).getAllByRole('columnheader')[0]).toHaveTextContent('default')
    expect(within(tables[3]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[3]).getAllByRole('columnheader')[1]).toHaveTextContent('list')
    expect(within(tables[3]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[4]).toHaveTextContent('Top Granule Sort Values')
    expect(within(tables[4]).getAllByRole('columnheader')).toHaveLength(3)
    expect(within(tables[4]).getAllByRole('cell')).toHaveLength(3)
    expect(within(tables[4]).getAllByRole('columnheader')[0]).toHaveTextContent('-end_date')
    expect(within(tables[4]).getAllByRole('cell')[0]).toHaveTextContent('1 (33.3%)')
    expect(within(tables[4]).getAllByRole('columnheader')[1]).toHaveTextContent('-start_date')
    expect(within(tables[4]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')
    expect(within(tables[4]).getAllByRole('columnheader')[2]).toHaveTextContent('default')
    expect(within(tables[4]).getAllByRole('cell')[2]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[5]).toHaveTextContent('Top Latitude Values')
    expect(within(tables[5]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[5]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[5]).getAllByRole('columnheader')[0]).toHaveTextContent('39.65176367593365')
    expect(within(tables[5]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[5]).getAllByRole('columnheader')[1]).toHaveTextContent('42.65176367593365')
    expect(within(tables[5]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[6]).toHaveTextContent('Top Longitude Values')
    expect(within(tables[6]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[6]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[6]).getAllByRole('columnheader')[0]).toHaveTextContent('-104.92001918508592')
    expect(within(tables[6]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[6]).getAllByRole('columnheader')[1]).toHaveTextContent('-100.92001918508592')
    expect(within(tables[6]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[7]).toHaveTextContent('Top Overlay Layers Values')
    expect(within(tables[7]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[7]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[7]).getAllByRole('columnheader')[0]).toHaveTextContent('referenceFeatures')
    expect(within(tables[7]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[7]).getAllByRole('columnheader')[1]).toHaveTextContent('bordersRoads')
    expect(within(tables[7]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[8]).toHaveTextContent('Top Panel State Values')
    expect(within(tables[8]).getAllByRole('columnheader')).toHaveLength(3)
    expect(within(tables[8]).getAllByRole('cell')).toHaveLength(3)
    expect(within(tables[8]).getAllByRole('columnheader')[0]).toHaveTextContent('full_width')
    expect(within(tables[8]).getAllByRole('cell')[0]).toHaveTextContent('1 (33.3%)')
    expect(within(tables[8]).getAllByRole('columnheader')[1]).toHaveTextContent('collapsed')
    expect(within(tables[8]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')
    expect(within(tables[8]).getAllByRole('columnheader')[2]).toHaveTextContent('default')
    expect(within(tables[8]).getAllByRole('cell')[2]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[9]).toHaveTextContent('Top Projection Values')
    expect(within(tables[9]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[9]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[9]).getAllByRole('columnheader')[0]).toHaveTextContent('epsg4326')
    expect(within(tables[9]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[9]).getAllByRole('columnheader')[1]).toHaveTextContent('epsg3413')
    expect(within(tables[9]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')

    expect(tableHeadings[10]).toHaveTextContent('Top Zoom Values')
    expect(within(tables[10]).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(tables[10]).getAllByRole('cell')).toHaveLength(2)
    expect(within(tables[10]).getAllByRole('columnheader')[0]).toHaveTextContent('7')
    expect(within(tables[10]).getAllByRole('cell')[0]).toHaveTextContent('2 (66.7%)')
    expect(within(tables[10]).getAllByRole('columnheader')[1]).toHaveTextContent('4')
    expect(within(tables[10]).getAllByRole('cell')[1]).toHaveTextContent('1 (33.3%)')
  })

  test('renders spinner when isLoading is true', () => {
    setup()

    expect(screen.getByTestId('admin-preferences-metric-list-spinner')).toBeInTheDocument()
  })
})
