import React from 'react'

import setupTest from '../../../../../../../jestConfigs/setupTest'
import OrderStatusItem from '../../OrderStatusItem'
import HarmonyStatusItem from '../HarmonyStatusItem'
import { STATUS_MESSAGES } from '../../../../constants/orderStatusMessages'

jest.mock('../../OrderStatusItem', () => jest.fn(() => <div />))

const mockUseGetRetrievalGranuleLinks = jest.fn()
jest.mock('../../../../hooks/useGetRetrievalGranuleLinks', () => ({
  useGetRetrievalGranuleLinks: () => mockUseGetRetrievalGranuleLinks()
}))

const setup = setupTest({
  Component: HarmonyStatusItem,
  defaultProps: {
    defaultOpen: true,
    onToggleAboutCSDAModal: jest.fn(),
    retrievalCollection: {
      collectionMetadata: {
        directDistributionInformation: {},
        title: 'Collection Title',
        isCSDA: false
      },
      granuleCount: 1,
      obfuscatedId: '12345',
      retrievalOrders: [{
        error: null,
        id: 145,
        orderInformation: {
          jobId: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
          links: [
            {
              rel: 'stac-catalog-json',
              href: 'https://harmony.earthdata.nasa.gov/stac/84def0e3-8934-4f15-bfe0-66d235d99fa6/',
              type: 'application/json',
              title: 'STAC catalog'
            },
            {
              rel: 'data',
              bbox: [
                28.74392,
                -67.01969,
                138.48301,
                77.66522
              ],
              href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747636/SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
              type: 'application/x-netcdf4',
              title: 'SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
              temporal: {
                end: '2023-01-16T16:05:35.000Z',
                start: '2023-01-16T15:14:30.000Z'
              }
            },
            {
              rel: 'data',
              bbox: [
                45.98281,
                -77.67212,
                -146.98405,
                77.67174
              ],
              href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747637/SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
              type: 'application/x-netcdf4',
              title: 'SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
              temporal: {
                end: '2024-08-20T08:07:15.000Z',
                start: '2024-08-20T07:15:48.000Z'
              }
            },
            {
              rel: 'data',
              bbox: [
                -180,
                -77.67199,
                180,
                77.67178
              ],
              href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747638/SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc',
              type: 'application/x-netcdf4',
              title: 'SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc',
              temporal: {
                end: '2024-08-20T08:58:42.000Z',
                start: '2024-08-20T08:07:15.000Z'
              }
            },
            {
              rel: 'self',
              href: 'https://harmony.earthdata.nasa.gov/jobs/84def0e3-8934-4f15-bfe0-66d235d99fa6?page=1&limit=2000',
              type: 'application/json',
              title: 'The current page'
            }
          ],
          labels: [
            'edsc-id=0549253121',
            'eed-edsc-dev'
          ],
          status: 'successful',
          message: 'The job has completed successfully',
          request: 'https://harmony.earthdata.nasa.gov/C2799465509-POCLOUD/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?forceAsync=true&granuleId=G3287590115-POCLOUD%2CG3287590092-POCLOUD%2CG3287590077-POCLOUD&variable=%2Fdata_20%2Falt_state_acq_mode_flag%2C%2Fdata_20%2Falt_state_track_trans_flag%2C%2Fdata_20%2Faltitude&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D0549253121',
          progress: 100,
          username: 'macrouch',
          createdAt: '2025-11-18T19:15:53.707Z',
          updatedAt: '2025-11-18T19:16:28.391Z',
          dataExpiration: '2025-12-18T19:15:53.707Z',
          outputDataSize: '5.69 MiB',
          numInputGranules: 11,
          originalDataSize: '74.60 MiB',
          dataSizePercentChange: '92.37% reduction'
        },
        orderNumber: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
        state: 'successful',
        type: 'Harmony'
      }],
      updatedAt: '2024-01-01T00:00:00Z'
    },
    retrievalId: '1'
  }
})

describe('HarmonyStatusItem', () => {
  describe('when the order is complete', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: ['https://example.com/browse'],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      const { props } = setup()

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'Harmony',
        className: 'order-status-item order-status-item--is-opened order-status-item--complete',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.COMPLETE,
        orderStatus: 'complete',
        progressPercentage: 100,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 1,
        totalOrders: 1,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})

      const orderStatusItemCall = (OrderStatusItem as jest.Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(4)

      const downloadFilesTab = tabs[0]
      expect(downloadFilesTab.props.title).toEqual('Download Files')
      const downloadFilesPanel = downloadFilesTab.props.children
      expect(downloadFilesPanel.props).toEqual({
        accessMethodType: 'Harmony',
        collectionIsCSDA: false,
        disableEddInProgress: false,
        downloadLinks: ['https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747636/SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc', 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747637/SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc', 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747638/SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc'],
        eddLink: 'earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D12345%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=undefined&clientId=eed-edsc-dev-serverless-client&token=Bearer null&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback',
        granuleCount: 1,
        granuleLinksIsLoading: false,
        retrievalId: '1',
        showTextWindowActions: false
      })

      const stacLinksTab = tabs[1]
      expect(stacLinksTab.props.title).toEqual('STAC Links')
      const stacLinksPanel = stacLinksTab.props.children
      expect(stacLinksPanel.props).toEqual({
        accessMethodType: 'Harmony',
        granuleCount: 1,
        retrievalId: '1',
        stacLinks: ['https://harmony.earthdata.nasa.gov/stac/84def0e3-8934-4f15-bfe0-66d235d99fa6/'],
        stacLinksIsLoading: false
      })

      const browseImageryTab = tabs[2]
      expect(browseImageryTab.props.title).toEqual('Browse Imagery')
      const browseLinksPanel = browseImageryTab.props.children
      expect(browseLinksPanel.props).toEqual({
        accessMethodType: 'Harmony',
        browseUrls: ['https://example.com/browse'],
        earthdataEnvironment: 'prod',
        eddLink: 'earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D12345%26flattenLinks%3Dtrue%26linkTypes%3Dbrowse%26ee%3Dprod&downloadId=undefined&clientId=eed-edsc-dev-serverless-client&token=Bearer null&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback',
        granuleCount: 1,
        granuleLinksIsLoading: false,
        retrievalCollection: {
          collectionMetadata: {
            directDistributionInformation: {},
            isCSDA: false,
            title: 'Collection Title'
          },
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalOrders: [{
            error: null,
            id: 145,
            orderInformation: {
              createdAt: '2025-11-18T19:15:53.707Z',
              dataExpiration: '2025-12-18T19:15:53.707Z',
              dataSizePercentChange: '92.37% reduction',
              jobId: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
              labels: ['edsc-id=0549253121', 'eed-edsc-dev'],
              links: [{
                href: 'https://harmony.earthdata.nasa.gov/stac/84def0e3-8934-4f15-bfe0-66d235d99fa6/',
                rel: 'stac-catalog-json',
                title: 'STAC catalog',
                type: 'application/json'
              }, {
                bbox: [28.74392, -67.01969, 138.48301, 77.66522],
                href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747636/SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
                rel: 'data',
                temporal: {
                  end: '2023-01-16T16:05:35.000Z',
                  start: '2023-01-16T15:14:30.000Z'
                },
                title: 'SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
                type: 'application/x-netcdf4'
              }, {
                bbox: [45.98281, -77.67212, -146.98405, 77.67174],
                href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747637/SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
                rel: 'data',
                temporal: {
                  end: '2024-08-20T08:07:15.000Z',
                  start: '2024-08-20T07:15:48.000Z'
                },
                title: 'SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
                type: 'application/x-netcdf4'
              }, {
                bbox: [-180, -77.67199, 180, 77.67178],
                href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747638/SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc',
                rel: 'data',
                temporal: {
                  end: '2024-08-20T08:58:42.000Z',
                  start: '2024-08-20T08:07:15.000Z'
                },
                title: 'SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc',
                type: 'application/x-netcdf4'
              }, {
                href: 'https://harmony.earthdata.nasa.gov/jobs/84def0e3-8934-4f15-bfe0-66d235d99fa6?page=1&limit=2000',
                rel: 'self',
                title: 'The current page',
                type: 'application/json'
              }],
              message: 'The job has completed successfully',
              numInputGranules: 11,
              originalDataSize: '74.60 MiB',
              outputDataSize: '5.69 MiB',
              progress: 100,
              request: 'https://harmony.earthdata.nasa.gov/C2799465509-POCLOUD/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?forceAsync=true&granuleId=G3287590115-POCLOUD%2CG3287590092-POCLOUD%2CG3287590077-POCLOUD&variable=%2Fdata_20%2Falt_state_acq_mode_flag%2C%2Fdata_20%2Falt_state_track_trans_flag%2C%2Fdata_20%2Faltitude&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D0549253121',
              status: 'successful',
              updatedAt: '2025-11-18T19:16:28.391Z',
              username: 'macrouch'
            },
            orderNumber: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
            state: 'successful',
            type: 'Harmony'
          }],
          updatedAt: '2024-01-01T00:00:00Z'
        },
        retrievalId: '1'
      })

      const orderStatusTab = tabs[3]
      expect(orderStatusTab.props.title).toEqual('Order Status')
      const orderStatusPanel = orderStatusTab.props.children
      expect(orderStatusPanel.props).toEqual({
        retrievalOrders: [{
          error: null,
          id: 145,
          orderInformation: {
            createdAt: '2025-11-18T19:15:53.707Z',
            dataExpiration: '2025-12-18T19:15:53.707Z',
            dataSizePercentChange: '92.37% reduction',
            jobId: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
            labels: ['edsc-id=0549253121', 'eed-edsc-dev'],
            links: [{
              href: 'https://harmony.earthdata.nasa.gov/stac/84def0e3-8934-4f15-bfe0-66d235d99fa6/',
              rel: 'stac-catalog-json',
              title: 'STAC catalog',
              type: 'application/json'
            }, {
              bbox: [28.74392, -67.01969, 138.48301, 77.66522],
              href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747636/SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
              rel: 'data',
              temporal: {
                end: '2023-01-16T16:05:35.000Z',
                start: '2023-01-16T15:14:30.000Z'
              },
              title: 'SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
              type: 'application/x-netcdf4'
            }, {
              bbox: [45.98281, -77.67212, -146.98405, 77.67174],
              href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747637/SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
              rel: 'data',
              temporal: {
                end: '2024-08-20T08:07:15.000Z',
                start: '2024-08-20T07:15:48.000Z'
              },
              title: 'SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
              type: 'application/x-netcdf4'
            }, {
              bbox: [-180, -77.67199, 180, 77.67178],
              href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747638/SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc',
              rel: 'data',
              temporal: {
                end: '2024-08-20T08:58:42.000Z',
                start: '2024-08-20T08:07:15.000Z'
              },
              title: 'SWOT_GPN_2PfP019_576_20240820_080715_20240820_085842_subsetted.nc',
              type: 'application/x-netcdf4'
            }, {
              href: 'https://harmony.earthdata.nasa.gov/jobs/84def0e3-8934-4f15-bfe0-66d235d99fa6?page=1&limit=2000',
              rel: 'self',
              title: 'The current page',
              type: 'application/json'
            }],
            message: 'The job has completed successfully',
            numInputGranules: 11,
            originalDataSize: '74.60 MiB',
            outputDataSize: '5.69 MiB',
            progress: 100,
            request: 'https://harmony.earthdata.nasa.gov/C2799465509-POCLOUD/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?forceAsync=true&granuleId=G3287590115-POCLOUD%2CG3287590092-POCLOUD%2CG3287590077-POCLOUD&variable=%2Fdata_20%2Falt_state_acq_mode_flag%2C%2Fdata_20%2Falt_state_track_trans_flag%2C%2Fdata_20%2Faltitude&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D0549253121',
            status: 'successful',
            updatedAt: '2025-11-18T19:16:28.391Z',
            username: 'macrouch'
          },
          orderNumber: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
          state: 'successful',
          type: 'Harmony'
        }]
      })
    })
  })

  describe('when the order is creating', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      const { props } = setup({
        overrideProps: {
          retrievalCollection: {
            collectionMetadata: {
              directDistributionInformation: {},
              title: 'Collection Title',
              isCSDA: false
            },
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalOrders: [{
              error: null,
              id: 145,
              orderInformation: {},
              orderNumber: null,
              state: 'creating',
              type: 'Harmony'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'Harmony',
        className: 'order-status-item order-status-item--is-opened',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.CREATING,
        orderStatus: 'creating',
        progressPercentage: 0,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 0,
        totalOrders: 1,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})
    })
  })

  describe('when the order is in progress', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      const { props } = setup({
        overrideProps: {
          retrievalCollection: {
            collectionMetadata: {
              directDistributionInformation: {},
              title: 'Collection Title',
              isCSDA: false
            },
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalOrders: [{
              error: null,
              id: 145,
              orderInformation: {
                jobId: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
                links: [
                  {
                    rel: 'canceler',
                    href: 'https://harmony.earthdata.nasa.gov/jobs/84def0e3-8934-4f15-bfe0-66d235d99fa6/cancel',
                    type: 'application/json',
                    title: 'Cancels the job.'
                  },
                  {
                    rel: 'pauser',
                    href: 'https://harmony.earthdata.nasa.gov/jobs/84def0e3-8934-4f15-bfe0-66d235d99fa6/pause',
                    type: 'application/json',
                    title: 'Pauses the job.'
                  },
                  {
                    rel: 'data',
                    bbox: [
                      28.74392,
                      -67.01969,
                      138.48301,
                      77.66522
                    ],
                    href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747636/SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
                    type: 'application/x-netcdf4',
                    title: 'SWOT_GPN_2PfP402_008_20230116_151430_20230116_160535_subsetted.nc',
                    temporal: {
                      end: '2023-01-16T16:05:35.000Z',
                      start: '2023-01-16T15:14:30.000Z'
                    }
                  },
                  {
                    rel: 'data',
                    bbox: [
                      45.98281,
                      -77.67212,
                      -146.98405,
                      77.67174
                    ],
                    href: 'https://harmony.earthdata.nasa.gov/service-results/harmony-prod-staging/public/84def0e3-8934-4f15-bfe0-66d235d99fa6/130747637/SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
                    type: 'application/x-netcdf4',
                    title: 'SWOT_GPN_2PfP019_575_20240820_071548_20240820_080715_subsetted.nc',
                    temporal: {
                      end: '2024-08-20T08:07:15.000Z',
                      start: '2024-08-20T07:15:48.000Z'
                    }
                  },
                  {
                    rel: 'self',
                    href: 'https://harmony.earthdata.nasa.gov/jobs/84def0e3-8934-4f15-bfe0-66d235d99fa6?page=1&limit=2000',
                    type: 'application/json',
                    title: 'The current page'
                  }
                ],
                labels: [
                  'edsc-id=0549253121',
                  'eed-edsc-dev'
                ],
                status: 'running',
                message: 'The job is being processed',
                request: 'https://harmony.earthdata.nasa.gov/C2799465509-POCLOUD/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?forceAsync=true&granuleId=G3287590115-POCLOUD%2CG3287590092-POCLOUD%2CG3287590077-POCLOUD%2CG3287590058-POCLOUD%2CG3287590040-POCLOUD%2CG3287590017-POCLOUD%2CG3287589996-POCLOUD%2CG3287589971-POCLOUD%2CG3287589875-POCLOUD%2CG3287589773-POCLOUD%2CG2871841475-POCLOUD&variable=%2Fdata_20%2Falt_state_acq_mode_flag%2C%2Fdata_20%2Falt_state_track_trans_flag%2C%2Fdata_20%2Faltitude&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D0549253121',
                progress: 25,
                username: 'macrouch',
                createdAt: '2025-11-18T19:15:53.707Z',
                updatedAt: '2025-11-18T19:16:04.014Z',
                dataExpiration: '2025-12-18T19:15:53.707Z',
                numInputGranules: 11
              },
              orderNumber: '84def0e3-8934-4f15-bfe0-66d235d99fa6',
              state: 'running',
              type: 'Harmony'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'Harmony',
        className: 'order-status-item order-status-item--is-opened order-status-item--in_progress',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.IN_PROGRESS,
        orderStatus: 'in progress',
        progressPercentage: 25,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 0,
        totalOrders: 1,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})
    })
  })

  describe('when the order has failed', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      const { props } = setup({
        overrideProps: {
          retrievalCollection: {
            collectionMetadata: {
              directDistributionInformation: {},
              title: 'Collection Title',
              isCSDA: false
            },
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalOrders: [{
              error: null,
              id: 126,
              orderInformation: {
                jobId: '37543d2b-c426-416c-9e44-f7fccf65d60f',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.earthdata.nasa.gov/jobs/37543d2b-c426-416c-9e44-f7fccf65d60f?page=1&limit=2000',
                    type: 'application/json',
                    title: 'The current page'
                  }
                ],
                labels: [
                  'edsc-id=3281558490',
                  'eed-edsc-dev'
                ],
                status: 'failed',
                message: 'Order Failed.',
                request: 'https://harmony.earthdata.nasa.gov/C2799465509-POCLOUD/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?forceAsync=true&granuleId=G3287590115-POCLOUD%2CG3287590092-POCLOUD%2CG3287590077-POCLOUD%2CG3287590058-POCLOUD%2CG3287590040-POCLOUD%2CG3287590017-POCLOUD%2CG3287589996-POCLOUD%2CG3287589971-POCLOUD%2CG3287589875-POCLOUD%2CG3287589773-POCLOUD%2CG2871841475-POCLOUD&variable=%2Fdata_20%2Falt_state_acq_mode_flag%2C%2Fdata_20%2Falt_state_track_trans_flag%2C%2Fdata_20%2Faltitude&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D3281558490',
                progress: 9,
                username: 'macrouch',
                createdAt: '2025-11-18T19:26:35.935Z',
                updatedAt: '2025-11-18T19:26:45.903Z',
                dataExpiration: '2025-12-18T19:26:35.935Z',
                numInputGranules: 11
              },
              orderNumber: '37543d2b-c426-416c-9e44-f7fccf65d60f',
              state: 'failed',
              type: 'Harmony'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'Harmony',
        className: 'order-status-item order-status-item--is-opened order-status-item--failed',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: true,
        messages: ['Order Failed.'],
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.FAILED,
        orderStatus: 'failed',
        progressPercentage: 100,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 1,
        totalOrders: 1,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})
    })
  })

  describe('when the order has been canceled', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      const { props } = setup({
        overrideProps: {
          retrievalCollection: {
            collectionMetadata: {
              directDistributionInformation: {},
              title: 'Collection Title',
              isCSDA: false
            },
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalOrders: [{
              error: null,
              id: 146,
              orderInformation: {
                jobId: '37543d2b-c426-416c-9e44-f7fccf65d60f',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.earthdata.nasa.gov/jobs/37543d2b-c426-416c-9e44-f7fccf65d60f?page=1&limit=2000',
                    type: 'application/json',
                    title: 'The current page'
                  }
                ],
                labels: [
                  'edsc-id=3281558490',
                  'eed-edsc-dev'
                ],
                status: 'canceled',
                message: 'Canceled by admin.',
                request: 'https://harmony.earthdata.nasa.gov/C2799465509-POCLOUD/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?forceAsync=true&granuleId=G3287590115-POCLOUD%2CG3287590092-POCLOUD%2CG3287590077-POCLOUD%2CG3287590058-POCLOUD%2CG3287590040-POCLOUD%2CG3287590017-POCLOUD%2CG3287589996-POCLOUD%2CG3287589971-POCLOUD%2CG3287589875-POCLOUD%2CG3287589773-POCLOUD%2CG2871841475-POCLOUD&variable=%2Fdata_20%2Falt_state_acq_mode_flag%2C%2Fdata_20%2Falt_state_track_trans_flag%2C%2Fdata_20%2Faltitude&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D3281558490',
                progress: 9,
                username: 'macrouch',
                createdAt: '2025-11-18T19:26:35.935Z',
                updatedAt: '2025-11-18T19:26:45.903Z',
                dataExpiration: '2025-12-18T19:26:35.935Z',
                numInputGranules: 11
              },
              orderNumber: '37543d2b-c426-416c-9e44-f7fccf65d60f',
              state: 'canceled',
              type: 'Harmony'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'Harmony',
        className: 'order-status-item order-status-item--is-opened order-status-item--canceled',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: ['Canceled by admin.'],
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.CANCELED,
        orderStatus: 'canceled',
        progressPercentage: 9,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 1,
        totalOrders: 1,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})
    })
  })

  describe('when there are no Browse URLs', () => {
    test('does not render the Browse tab', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      setup()

      const orderStatusItemCall = (OrderStatusItem as jest.Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(3)

      const downloadFilesTab = tabs[0]
      expect(downloadFilesTab.props.title).toEqual('Download Files')

      const stacLinksTab = tabs[1]
      expect(stacLinksTab.props.title).toEqual('STAC Links')

      const orderStatusTab = tabs[2]
      expect(orderStatusTab.props.title).toEqual('Order Status')
    })
  })
})
