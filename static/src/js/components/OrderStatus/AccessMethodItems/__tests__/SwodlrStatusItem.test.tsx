import React from 'react'
import type { Mock } from 'vitest'

import setupTest from '../../../../../../../vitestConfigs/setupTest'
import OrderStatusItem from '../../OrderStatusItem'
import SwodlrStatusItem from '../SwodlrStatusItem'
import { STATUS_MESSAGES } from '../../../../constants/orderStatusMessages'

vi.mock('../../OrderStatusItem', () => ({ default: vi.fn(() => <div />) }))

const mockUseGetRetrievalGranuleLinks = vi.fn()
vi.mock('../../../../hooks/useGetRetrievalGranuleLinks', () => ({
  useGetRetrievalGranuleLinks: () => mockUseGetRetrievalGranuleLinks()
}))

vi.mock('../../buildEddLink', () => ({ default: vi.fn().mockReturnValue('mock-eddlink') }))

const setup = setupTest({
  Component: SwodlrStatusItem,
  defaultProps: {
    defaultOpen: true,
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
        id: 143,
        orderInformation: {
          jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
          reason: null,
          status: 'complete',
          granules: [
            {
              id: '192007e1-1f19-49ea-be3c-1655e9e37b02',
              uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/69cf2791-60ee-4867-8ef3-c3f02bfc56f6/1724207855/SWOT_L2_HR_Raster_90m_UTM45V_N_x_x_x_011_424_027F_20240229T235524_20240229T235545_DIC0_01.nc',
              timestamp: '2024-08-21T02:37:43.076'
            }
          ],
          createdAt: '2024-08-21T02:37:42.936',
          productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
          updatedAt: '2024-08-21T01:35:54.619529'
        },
        orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
        state: 'complete',
        type: 'SWODLR'
      }],
      updatedAt: '2024-01-01T00:00:00Z'
    },
    retrievalId: '1'
  }
})

describe('SwodlrStatusItem', () => {
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

      setup()

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'SWODLR',
        className: 'order-status-item order-status-item--is-opened order-status-item--complete',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.SWODLR.COMPLETE,
        orderStatus: 'complete',
        progressPercentage: 100,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 1,
        totalOrders: 1,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})

      const orderStatusItemCall = (OrderStatusItem as Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(3)

      const downloadFilesTab = tabs[0]
      expect(downloadFilesTab.props.title).toEqual('Download Files')
      const downloadFilesPanel = downloadFilesTab.props.children
      expect(downloadFilesPanel.props).toEqual({
        accessMethodType: 'SWODLR',
        collectionIsCSDA: false,
        disableEddInProgress: false,
        downloadLinks: ['https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/69cf2791-60ee-4867-8ef3-c3f02bfc56f6/1724207855/SWOT_L2_HR_Raster_90m_UTM45V_N_x_x_x_011_424_027F_20240229T235524_20240229T235545_DIC0_01.nc'],
        eddLink: 'mock-eddlink',
        granuleCount: 1,
        granuleLinksIsLoading: false,
        retrievalId: '1',
        showTextWindowActions: false
      })

      const browseImageryTab = tabs[1]
      expect(browseImageryTab.props.title).toEqual('Browse Imagery')
      const browseLinksPanel = browseImageryTab.props.children
      expect(browseLinksPanel.props).toEqual({
        accessMethodType: 'SWODLR',
        browseUrls: ['https://example.com/browse'],
        earthdataEnvironment: 'prod',
        eddLink: 'mock-eddlink',
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
            id: 143,
            orderInformation: {
              createdAt: '2024-08-21T02:37:42.936',
              granules: [{
                id: '192007e1-1f19-49ea-be3c-1655e9e37b02',
                timestamp: '2024-08-21T02:37:43.076',
                uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/69cf2791-60ee-4867-8ef3-c3f02bfc56f6/1724207855/SWOT_L2_HR_Raster_90m_UTM45V_N_x_x_x_011_424_027F_20240229T235524_20240229T235545_DIC0_01.nc'
              }],
              jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
              productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
              reason: null,
              status: 'complete',
              updatedAt: '2024-08-21T01:35:54.619529'
            },
            orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
            state: 'complete',
            type: 'SWODLR'
          }],
          updatedAt: '2024-01-01T00:00:00Z'
        },
        retrievalId: '1'
      })

      const orderStatusTab = tabs[2]
      expect(orderStatusTab.props.title).toEqual('Order Status')
      const orderStatusPanel = orderStatusTab.props.children
      expect(orderStatusPanel.props).toEqual({
        retrievalOrders: [{
          error: null,
          id: 143,
          orderInformation: {
            createdAt: '2024-08-21T02:37:42.936',
            granules: [{
              id: '192007e1-1f19-49ea-be3c-1655e9e37b02',
              timestamp: '2024-08-21T02:37:43.076',
              uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/69cf2791-60ee-4867-8ef3-c3f02bfc56f6/1724207855/SWOT_L2_HR_Raster_90m_UTM45V_N_x_x_x_011_424_027F_20240229T235524_20240229T235545_DIC0_01.nc'
            }],
            jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
            productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
            reason: null,
            status: 'complete',
            updatedAt: '2024-08-21T01:35:54.619529'
          },
          orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
          state: 'complete',
          type: 'SWODLR'
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

      setup({
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
              id: 147,
              orderInformation: {},
              orderNumber: null,
              state: 'creating',
              type: 'SWODLR'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'SWODLR',
        className: 'order-status-item order-status-item--is-opened',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.SWODLR.CREATING,
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

      setup({
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
              id: 147,
              orderInformation: {
                jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
                status: 'GENERATING',
                createdAt: '2024-08-21T02:37:42.936',
                productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
                updatedAt: '2024-08-21T02:37:42.936',
                numGranules: 1
              },
              orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
              state: 'in_progress',
              type: 'SWODLR'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'SWODLR',
        className: 'order-status-item order-status-item--is-opened order-status-item--in_progress',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.SWODLR.IN_PROGRESS,
        orderStatus: 'in_progress',
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

      setup({
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
              id: 147,
              orderInformation: {
                jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
                status: 'FAILED',
                createdAt: '2024-08-21T02:37:42.936',
                productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
                updatedAt: '2024-08-21T02:37:42.936',
                reason: 'Mock Error'
              },
              orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
              state: 'failed',
              type: 'SWODLR'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'SWODLR',
        className: 'order-status-item order-status-item--is-opened order-status-item--failed',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: true,
        messages: ['Mock Error'],
        opened: true,
        orderInfo: STATUS_MESSAGES.SWODLR.FAILED,
        orderStatus: 'failed',
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

  describe('when there are no S3 or Browse URLs', () => {
    test('does not render the S3 or Browse tabs', async () => {
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

      const orderStatusItemCall = (OrderStatusItem as Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(2)

      const downloadFilesTab = tabs[0]
      expect(downloadFilesTab.props.title).toEqual('Download Files')

      const orderStatusTab = tabs[1]
      expect(orderStatusTab.props.title).toEqual('Order Status')
    })
  })
})
