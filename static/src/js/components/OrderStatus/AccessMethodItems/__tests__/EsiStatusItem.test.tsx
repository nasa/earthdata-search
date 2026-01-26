import React from 'react'
import type { Mock } from 'vitest'

import setupTest from '../../../../../../../vitestConfigs/setupTest'
import OrderStatusItem from '../../OrderStatusItem'
import EsiStatusItem from '../EsiStatusItem'
import { STATUS_MESSAGES } from '../../../../constants/orderStatusMessages'

vi.mock('../../OrderStatusItem', () => ({ default: vi.fn(() => <div />) }))

const mockUseGetRetrievalGranuleLinks = vi.fn()
vi.mock('../../../../hooks/useGetRetrievalGranuleLinks', () => ({
  useGetRetrievalGranuleLinks: () => mockUseGetRetrievalGranuleLinks()
}))

vi.mock('../../buildEddLink', () => ({ default: vi.fn().mockReturnValue('mock-eddlink') }))

const setup = setupTest({
  Component: EsiStatusItem,
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
        id: 144,
        orderInformation: {
          order: {
            orderId: 5000006631338,
            instructions: 'Your request has completed processing. You may retrieve the results from the download URLs until 2025-12-02 11:31:33.339'
          },
          xmlns: '',
          'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
          'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
          'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
          processInfo: {
            subagentId: 'ICESAT2',
            processDuration: 'P0Y0M0DT0H0M8.330S'
          },
          downloadUrls: {
            downloadUrl: [
              'https://n5eil02u.ecs.nsidc.org/esir/5000006631338.html',
              'https://n5eil02u.ecs.nsidc.org/esir/5000006631338.zip'
            ]
          },
          requestStatus: {
            status: 'complete',
            totalNumber: 1,
            numberProcessed: 1
          },
          contactInformation: {
            contactName: 'NSIDC User Services',
            contactEmail: 'nsidc@nsidc.org'
          }
        },
        orderNumber: '5000006631338',
        state: 'complete',
        type: 'ESI'
      }],
      updatedAt: '2024-01-01T00:00:00Z'
    },
    retrievalId: '1'
  }
})

describe('EsiStatusItem', () => {
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
        accessMethodType: 'ESI',
        className: 'order-status-item order-status-item--is-opened order-status-item--complete',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
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

      const orderStatusItemCall = (OrderStatusItem as Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(3)

      const downloadFilesTab = tabs[0]
      expect(downloadFilesTab.props.title).toEqual('Download Files')
      const downloadFilesPanel = downloadFilesTab.props.children
      expect(downloadFilesPanel.props).toEqual({
        accessMethodType: 'ESI',
        collectionIsCSDA: false,
        disableEddInProgress: false,
        downloadLinks: ['https://n5eil02u.ecs.nsidc.org/esir/5000006631338.html', 'https://n5eil02u.ecs.nsidc.org/esir/5000006631338.zip'],
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
        accessMethodType: 'ESI',
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
            id: 144,
            orderInformation: {
              contactInformation: {
                contactEmail: 'nsidc@nsidc.org',
                contactName: 'NSIDC User Services'
              },
              downloadUrls: { downloadUrl: ['https://n5eil02u.ecs.nsidc.org/esir/5000006631338.html', 'https://n5eil02u.ecs.nsidc.org/esir/5000006631338.zip'] },
              order: {
                instructions: 'Your request has completed processing. You may retrieve the results from the download URLs until 2025-12-02 11:31:33.339',
                orderId: 5000006631338
              },
              processInfo: {
                processDuration: 'P0Y0M0DT0H0M8.330S',
                subagentId: 'ICESAT2'
              },
              requestStatus: {
                numberProcessed: 1,
                status: 'complete',
                totalNumber: 1
              },
              xmlns: '',
              'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
              'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
              'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
              'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
            },
            orderNumber: '5000006631338',
            state: 'complete',
            type: 'ESI'
          }],
          updatedAt: '2024-01-01T00:00:00Z'
        },
        retrievalId: '1'
      })

      const orderStatusTab = tabs[2]
      expect(orderStatusTab.props.title).toEqual('Order Status')
      const orderStatusPanel = orderStatusTab.props.children
      expect(orderStatusPanel.props).toEqual({
        contactEmail: 'nsidc@nsidc.org',
        contactName: 'NSIDC User Services',
        retrievalOrders: [{
          error: null,
          id: 144,
          orderInformation: {
            contactInformation: {
              contactEmail: 'nsidc@nsidc.org',
              contactName: 'NSIDC User Services'
            },
            downloadUrls: { downloadUrl: ['https://n5eil02u.ecs.nsidc.org/esir/5000006631338.html', 'https://n5eil02u.ecs.nsidc.org/esir/5000006631338.zip'] },
            order: {
              instructions: 'Your request has completed processing. You may retrieve the results from the download URLs until 2025-12-02 11:31:33.339',
              orderId: 5000006631338
            },
            processInfo: {
              processDuration: 'P0Y0M0DT0H0M8.330S',
              subagentId: 'ICESAT2'
            },
            requestStatus: {
              numberProcessed: 1,
              status: 'complete',
              totalNumber: 1
            },
            xmlns: '',
            'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
            'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
            'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
            'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
          },
          orderNumber: '5000006631338',
          state: 'complete',
          type: 'ESI'
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
              id: 144,
              orderInformation: {},
              orderNumber: null,
              state: 'creating',
              type: 'ESI'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ESI',
        className: 'order-status-item order-status-item--is-opened',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
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
              id: 144,
              orderInformation: {},
              orderNumber: '5000006631338',
              state: 'initialized',
              type: 'ESI'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ESI',
        className: 'order-status-item order-status-item--is-opened order-status-item--in_progress',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.IN_PROGRESS,
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
              id: 126,
              orderInformation: {},
              orderNumber: null,
              state: 'create_failed',
              type: 'ESI'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ESI',
        className: 'order-status-item order-status-item--is-opened order-status-item--failed',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.FAILED,
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
              id: 126,
              orderInformation: {},
              orderNumber: null,
              state: 'canceled',
              type: 'ESI'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ESI',
        className: 'order-status-item order-status-item--is-opened order-status-item--canceled',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.ESI.CANCELED,
        orderStatus: 'canceled',
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
